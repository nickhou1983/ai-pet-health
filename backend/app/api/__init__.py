from fastapi import APIRouter

from app.api.chat import router as chat_router
from app.api.consultation import router as consultation_router
from app.api.health import router as health_router

router = APIRouter()
router.include_router(health_router, tags=["health"])
router.include_router(consultation_router, tags=["consultations"])
router.include_router(chat_router, tags=["chat"])
