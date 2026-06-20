from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.consultation import router as consultation_router
from app.api.health import router as health_router
from app.api.pets import router as pets_router
from app.api.breeds import router as breeds_router

router = APIRouter()
router.include_router(health_router, tags=["health"])
router.include_router(auth_router)
router.include_router(consultation_router, tags=["consultations"])
router.include_router(chat_router, tags=["chat"])
router.include_router(pets_router, prefix="/pets", tags=["pets"])
router.include_router(breeds_router, prefix="/breeds", tags=["breeds"])
