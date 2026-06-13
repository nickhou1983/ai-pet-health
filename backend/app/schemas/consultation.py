from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models import ConsultationStatus, UrgencyLevel


class ConsultationCreate(BaseModel):
    pet_id: str | None = None
    title: str | None = "新问诊"
    pet_info: dict[str, Any] | None = None


class ConsultationUpdate(BaseModel):
    title: str | None = None
    status: ConsultationStatus | None = None


class ConsultationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: str
    pet_id: str | None = None
    title: str
    status: ConsultationStatus
    urgency_level: UrgencyLevel
    summary: str | None = None
    pet_info: dict[str, Any] | None = None
    created_at: datetime
    updated_at: datetime | None = None
    messages_count: int = 0


class ConsultationListResponse(BaseModel):
    items: list[ConsultationResponse] = Field(default_factory=list)
    total: int
    skip: int
    limit: int
