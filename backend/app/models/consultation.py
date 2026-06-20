from __future__ import annotations

import enum
import uuid

from sqlalchemy import Column, DateTime, Enum as SAEnum, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class ConsultationStatus(str, enum.Enum):
    active = "active"
    closed = "closed"


class UrgencyLevel(str, enum.Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), nullable=False, index=True)
    pet_id = Column(String(100), nullable=True)
    title = Column(String(200), nullable=False, default="新问诊")
    status = Column(SAEnum(ConsultationStatus), nullable=False, default=ConsultationStatus.active)
    urgency_level = Column(SAEnum(UrgencyLevel), nullable=False, default=UrgencyLevel.none)
    summary = Column(Text, nullable=True)
    pet_info = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    messages = relationship(
        "Message",
        back_populates="consultation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )
