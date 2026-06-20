"""Pydantic schemas for request/response validation."""

from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationListResponse,
    ConsultationResponse,
    ConsultationUpdate,
)
from app.schemas.message import ChatRequest, MessageCreate, MessageResponse, ReportResponse
from app.schemas.user import (  # noqa: F401
    TokenRefreshRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)

__all__ = [
    "ChatRequest",
    "ConsultationCreate",
    "ConsultationListResponse",
    "ConsultationResponse",
    "ConsultationUpdate",
    "MessageCreate",
    "MessageResponse",
    "ReportResponse",
    "TokenRefreshRequest",
    "TokenResponse",
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "UserUpdate",
]
