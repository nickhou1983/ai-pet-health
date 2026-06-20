from __future__ import annotations

import json
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationListResponse,
    ConsultationResponse,
    ConsultationUpdate,
)
from app.services.consultation_service import consultation_service

router = APIRouter(prefix="/consultations")


def _decode_pet_info(value: str | None) -> dict | None:
    if not value:
        return None
    return json.loads(value)


def _serialize_consultation(consultation) -> ConsultationResponse:
    return ConsultationResponse.model_validate(
        {
            "id": consultation.id,
            "user_id": consultation.user_id,
            "pet_id": consultation.pet_id,
            "title": consultation.title,
            "status": consultation.status,
            "urgency_level": consultation.urgency_level,
            "summary": consultation.summary,
            "pet_info": _decode_pet_info(consultation.pet_info),
            "created_at": consultation.created_at,
            "updated_at": consultation.updated_at,
            "messages_count": getattr(consultation, "messages_count", 0),
        }
    )


def get_user_id(x_user_id: str | None = Header(default=None)) -> str:
    return x_user_id or "demo-user"


@router.post("", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
async def create_consultation(
    payload: ConsultationCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> ConsultationResponse:
    consultation = await consultation_service.create_consultation(db, user_id, payload)
    return _serialize_consultation(consultation)


@router.get("", response_model=ConsultationListResponse)
async def list_consultations(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> ConsultationListResponse:
    consultations, total = await consultation_service.list_consultations(db, user_id, skip, limit)
    return ConsultationListResponse(
        items=[_serialize_consultation(item) for item in consultations],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{consultation_id}", response_model=ConsultationResponse)
async def get_consultation(
    consultation_id: UUID,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> ConsultationResponse:
    consultation = await consultation_service.get_consultation(db, consultation_id, user_id=user_id)
    return _serialize_consultation(consultation)


@router.patch("/{consultation_id}", response_model=ConsultationResponse)
async def update_consultation(
    consultation_id: UUID,
    payload: ConsultationUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> ConsultationResponse:
    consultation = await consultation_service.update_consultation(
        db,
        consultation_id,
        payload,
        user_id=user_id,
    )
    return _serialize_consultation(consultation)


@router.delete("/{consultation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consultation(
    consultation_id: UUID,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_user_id),
) -> Response:
    await consultation_service.delete_consultation(db, consultation_id, user_id=user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
