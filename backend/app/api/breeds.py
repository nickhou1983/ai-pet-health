"""Breed API routes."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.breed import BreedResponse
from app.services import breed as breed_service

router = APIRouter()


@router.get("", response_model=list[BreedResponse])
async def list_breeds(
    species: str | None = Query(default=None, pattern="^(cat|dog|other)$"),
    db: AsyncSession = Depends(get_db),
):
    return await breed_service.get_breeds(db, species)
