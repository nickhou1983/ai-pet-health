from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models import MessageRole, UrgencyLevel


class MessageCreate(BaseModel):
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    content: str = Field(min_length=1)


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    consultation_id: UUID
    role: MessageRole
    content: str
    created_at: datetime


class ReportResponse(BaseModel):
    report: str
    urgency_level: UrgencyLevel
    recommendations: list[str] = Field(default_factory=list)
