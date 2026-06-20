"""Health record and weight log database models."""

import uuid
from datetime import date as DateType, datetime
from enum import Enum as PyEnum

from sqlalchemy import Date, DateTime, Float, String, Text, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class RecordType(str, PyEnum):
    VACCINE = "vaccine"
    DEWORMING = "deworming"
    CHECKUP = "checkup"
    MEDICAL = "medical"
    SURGERY = "surgery"


class HealthRecord(Base):
    __tablename__ = "health_records"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    pet_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False, default=RecordType.CHECKUP)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    date: Mapped[DateType] = mapped_column(Date, nullable=False)
    next_date: Mapped[DateType | None] = mapped_column(Date, nullable=True)
    hospital: Mapped[str | None] = mapped_column(String(200), nullable=True)
    doctor: Mapped[str | None] = mapped_column(String(100), nullable=True)
    diagnosis: Mapped[str | None] = mapped_column(Text, nullable=True)
    medication: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    attachments: Mapped[list | None] = mapped_column(JSONB, nullable=True, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class WeightLog(Base):
    __tablename__ = "weight_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    pet_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    date: Mapped[DateType] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
