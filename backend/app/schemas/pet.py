"""Pet schemas for request/response validation."""

import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field


class PetCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    species: str = Field(default="dog", pattern="^(cat|dog|other)$")
    breed: str | None = Field(default=None, max_length=100)
    gender: str = Field(default="unknown", pattern="^(male|female|unknown)$")
    birthday: date | None = None
    weight: float | None = Field(default=None, gt=0, le=200)
    is_neutered: bool = False
    chip_number: str | None = Field(default=None, max_length=50)
    notes: str | None = None


class PetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    species: str | None = Field(default=None, pattern="^(cat|dog|other)$")
    breed: str | None = Field(default=None, max_length=100)
    gender: str | None = Field(default=None, pattern="^(male|female|unknown)$")
    birthday: date | None = None
    weight: float | None = Field(default=None, gt=0, le=200)
    is_neutered: bool | None = None
    chip_number: str | None = Field(default=None, max_length=50)
    avatar_url: str | None = None
    notes: str | None = None


class PetResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    species: str
    breed: str | None
    gender: str
    birthday: date | None
    weight: float | None
    is_neutered: bool
    chip_number: str | None
    avatar_url: str | None
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
