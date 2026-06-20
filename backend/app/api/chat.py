from __future__ import annotations

import json
from collections.abc import AsyncGenerator
from uuid import UUID

from fastapi import APIRouter, Depends, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models import MessageRole, UrgencyLevel
from app.schemas.message import ChatRequest, MessageResponse, ReportResponse
from app.services.consultation_service import consultation_service
from app.services.llm_service import llm_service

router = APIRouter(prefix="/consultations")


def get_user_id(x_user_id: str | None = Header(default=None)) -> str:
    return x_user_id or "demo-user"


def _sse_event(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


@router.post("/{consultation_id}/messages")
async def create_message(
    consultation_id: UUID,
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> StreamingResponse:
    consultation = await consultation_service.get_consultation(db, consultation_id, user_id=user_id)
    await consultation_service.add_message(db, consultation_id, MessageRole.user, payload.content)
    history = await consultation_service.get_messages(db, consultation_id, user_id=user_id)
    prompt_messages = consultation_service.build_chat_context(consultation, history)

    async def event_stream() -> AsyncGenerator[str, None]:
        chunks: list[str] = []
        try:
            async for token in llm_service.chat_completion_stream(prompt_messages):
                chunks.append(token)
                yield _sse_event({"content": token, "done": False})

            assistant_content = "".join(chunks).strip()
            if assistant_content:
                await consultation_service.add_message(
                    db,
                    consultation_id,
                    MessageRole.assistant,
                    assistant_content,
                )

            urgency_level = UrgencyLevel.none
            if assistant_content:
                report = await consultation_service.generate_report(
                    db,
                    consultation_id,
                    user_id=user_id,
                )
                urgency_level = report["urgency_level"]

            yield _sse_event(
                {
                    "content": "",
                    "done": True,
                    "urgency_level": urgency_level.value,
                }
            )
        except Exception as exc:
            yield _sse_event(
                {
                    "error": str(exc),
                    "done": True,
                    "urgency_level": UrgencyLevel.none.value,
                }
            )

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/{consultation_id}/messages", response_model=list[MessageResponse])
async def get_messages(
    consultation_id: UUID,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> list[MessageResponse]:
    messages = await consultation_service.get_messages(db, consultation_id, user_id=user_id)
    return [MessageResponse.model_validate(message) for message in messages]


@router.post("/{consultation_id}/report", response_model=ReportResponse)
async def generate_report(
    consultation_id: UUID,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> ReportResponse:
    report = await consultation_service.generate_report(db, consultation_id, user_id=user_id)
    return ReportResponse.model_validate(report)
