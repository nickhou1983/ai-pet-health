from __future__ import annotations

import json
import re
from typing import Any
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException, NotFoundException
from app.models import Consultation, ConsultationStatus, Message, MessageRole, UrgencyLevel
from app.schemas.consultation import ConsultationCreate, ConsultationUpdate
from app.services.llm_service import llm_service
from app.services.prompt_service import prompt_service


class ConsultationService:
    async def create_consultation(
        self,
        db: AsyncSession,
        user_id: str,
        data: ConsultationCreate,
    ) -> Consultation:
        consultation = Consultation(
            user_id=user_id,
            pet_id=data.pet_id,
            title=data.title or "新问诊",
            pet_info=self._dump_pet_info(data.pet_info),
        )
        db.add(consultation)
        await db.flush()
        await db.refresh(consultation)
        setattr(consultation, "messages_count", 0)
        return consultation

    async def get_consultation(
        self,
        db: AsyncSession,
        consultation_id: UUID,
        user_id: str | None = None,
    ) -> Consultation:
        query = (
            select(Consultation, func.count(Message.id).label("messages_count"))
            .outerjoin(Message, Message.consultation_id == Consultation.id)
            .where(Consultation.id == consultation_id)
            .group_by(Consultation.id)
        )
        if user_id:
            query = query.where(Consultation.user_id == user_id)

        result = await db.execute(query)
        row = result.first()
        if row is None:
            raise NotFoundException("Consultation not found")

        consultation, messages_count = row
        setattr(consultation, "messages_count", messages_count)
        return consultation

    async def list_consultations(
        self,
        db: AsyncSession,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Consultation], int]:
        total = await db.scalar(
            select(func.count(Consultation.id)).where(Consultation.user_id == user_id)
        )
        result = await db.execute(
            select(Consultation, func.count(Message.id).label("messages_count"))
            .outerjoin(Message, Message.consultation_id == Consultation.id)
            .where(Consultation.user_id == user_id)
            .group_by(Consultation.id)
            .order_by(Consultation.updated_at.desc(), Consultation.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        items: list[Consultation] = []
        for consultation, messages_count in result.all():
            setattr(consultation, "messages_count", messages_count)
            items.append(consultation)
        return items, int(total or 0)

    async def update_consultation(
        self,
        db: AsyncSession,
        consultation_id: UUID,
        data: ConsultationUpdate,
        user_id: str | None = None,
    ) -> Consultation:
        consultation = await self.get_consultation(db, consultation_id, user_id=user_id)
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(consultation, field, value)
        await db.flush()
        await db.refresh(consultation)
        setattr(consultation, "messages_count", getattr(consultation, "messages_count", 0))
        return consultation

    async def delete_consultation(
        self,
        db: AsyncSession,
        consultation_id: UUID,
        user_id: str | None = None,
    ) -> None:
        consultation = await self.get_consultation(db, consultation_id, user_id=user_id)
        await db.delete(consultation)
        await db.flush()

    async def add_message(
        self,
        db: AsyncSession,
        consultation_id: UUID,
        role: MessageRole,
        content: str,
    ) -> Message:
        message = Message(
            consultation_id=consultation_id,
            role=role,
            content=content,
        )
        db.add(message)
        await db.flush()
        await db.refresh(message)
        return message

    async def get_messages(
        self,
        db: AsyncSession,
        consultation_id: UUID,
        user_id: str | None = None,
    ) -> list[Message]:
        if user_id:
            await self.get_consultation(db, consultation_id, user_id=user_id)

        result = await db.execute(
            select(Message)
            .where(Message.consultation_id == consultation_id)
            .order_by(Message.created_at.asc())
        )
        return list(result.scalars().all())

    async def generate_report(
        self,
        db: AsyncSession,
        consultation_id: UUID,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        consultation = await self.get_consultation(db, consultation_id, user_id=user_id)
        messages = await self.get_messages(db, consultation_id)
        if not messages:
            raise AppException(status_code=400, detail="No messages found for consultation")

        response = await llm_service.chat_completion(
            prompt_service.build_report_messages(consultation, messages)
        )
        payload = self._parse_llm_json(response)
        report = payload.get("report") or response.strip()
        urgency_level = self._coerce_urgency(payload.get("urgency_level"))
        recommendations = payload.get("recommendations")
        if not isinstance(recommendations, list):
            recommendations = []

        consultation.summary = report
        consultation.urgency_level = urgency_level
        await db.flush()

        return {
            "report": report,
            "urgency_level": urgency_level,
            "recommendations": [str(item) for item in recommendations if str(item).strip()],
        }

    def build_chat_context(
        self,
        consultation: Consultation,
        messages: list[Message],
    ) -> list[dict[str, str]]:
        return prompt_service.build_chat_messages(consultation, messages)

    def _dump_pet_info(self, pet_info: dict[str, Any] | None) -> str | None:
        if pet_info is None:
            return None
        return json.dumps(pet_info, ensure_ascii=False)

    def _parse_llm_json(self, response: str) -> dict[str, Any]:
        cleaned = response.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(0)
        try:
            payload = json.loads(cleaned)
            return payload if isinstance(payload, dict) else {}
        except json.JSONDecodeError:
            return {}

    def _coerce_urgency(self, value: Any) -> UrgencyLevel:
        if isinstance(value, UrgencyLevel):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            for level in UrgencyLevel:
                if level.value == normalized:
                    return level
        return UrgencyLevel.none


consultation_service = ConsultationService()
