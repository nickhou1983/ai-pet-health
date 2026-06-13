"""Pydantic schemas for user and authentication."""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# --- User schemas ---


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    nickname: str | None = Field(default=None, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    nickname: str | None
    avatar_url: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    nickname: str | None = Field(default=None, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=500)


# --- Token schemas ---


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefreshRequest(BaseModel):
    refresh_token: str
