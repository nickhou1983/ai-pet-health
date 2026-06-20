"""Database models."""

from app.models.consultation import Consultation, ConsultationStatus, UrgencyLevel
from app.models.message import Message, MessageRole
from app.models.user import User  # noqa: F401
from app.models.pet import Pet  # noqa: F401
from app.models.breed import Breed  # noqa: F401
from app.models.health import HealthRecord, RecordType, WeightLog  # noqa: F401

__all__ = [
    "Consultation", "ConsultationStatus", "UrgencyLevel",
    "Message", "MessageRole",
    "User", "Pet", "Breed",
    "HealthRecord", "RecordType", "WeightLog",
]
