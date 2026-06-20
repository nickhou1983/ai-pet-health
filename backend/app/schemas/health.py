"""Health record and weight log schemas."""

import uuid
from datetime import date as DateType, datetime

from pydantic import BaseModel, Field

RECORD_TYPE_PATTERN = "^(vaccine|deworming|checkup|medical|surgery)$"


class HealthRecordCreate(BaseModel):
    type: str = Field(default="checkup", pattern=RECORD_TYPE_PATTERN)
    title: str = Field(..., min_length=1, max_length=200)
    date: DateType
    next_date: DateType | None = None
    hospital: str | None = Field(default=None, max_length=200)
    doctor: str | None = Field(default=None, max_length=100)
    diagnosis: str | None = None
    medication: str | None = None
    notes: str | None = None
    attachments: list[str] | None = None


class HealthRecordUpdate(BaseModel):
    type: str | None = Field(default=None, pattern=RECORD_TYPE_PATTERN)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    date: DateType | None = None
    next_date: DateType | None = None
    hospital: str | None = Field(default=None, max_length=200)
    doctor: str | None = Field(default=None, max_length=100)
    diagnosis: str | None = None
    medication: str | None = None
    notes: str | None = None
    attachments: list[str] | None = None


class HealthRecordResponse(BaseModel):
    id: uuid.UUID
    pet_id: uuid.UUID
    type: str
    title: str
    date: DateType
    next_date: DateType | None
    hospital: str | None
    doctor: str | None
    diagnosis: str | None
    medication: str | None
    notes: str | None
    attachments: list[str] | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WeightLogCreate(BaseModel):
    weight: float = Field(..., gt=0, le=200)
    date: DateType


class WeightLogResponse(BaseModel):
    id: uuid.UUID
    pet_id: uuid.UUID
    weight: float
    date: DateType
    created_at: datetime

    model_config = {"from_attributes": True}
