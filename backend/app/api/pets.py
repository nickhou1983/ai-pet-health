"""Pet API routes."""

import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, Header, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException
from app.db.session import get_db
from app.schemas.pet import PetCreate, PetResponse, PetUpdate
from app.services import pet as pet_service

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def _get_user_id(x_user_id: str = Header(default="00000000-0000-0000-0000-000000000001")) -> uuid.UUID:
    """Extract user_id from header. Placeholder until auth is implemented."""
    return uuid.UUID(x_user_id)


@router.post("", response_model=PetResponse, status_code=201)
async def create_pet(
    data: PetCreate,
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await pet_service.create_pet(db, user_id, data)


@router.get("", response_model=list[PetResponse])
async def list_pets(
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await pet_service.get_pets_by_user(db, user_id)


@router.get("/{pet_id}", response_model=PetResponse)
async def get_pet(
    pet_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    return await pet_service.get_pet(db, pet_id)


@router.put("/{pet_id}", response_model=PetResponse)
async def update_pet(
    pet_id: uuid.UUID,
    data: PetUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await pet_service.update_pet(db, pet_id, data)


@router.delete("/{pet_id}", status_code=204)
async def delete_pet(
    pet_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    await pet_service.delete_pet(db, pet_id)


@router.post("/{pet_id}/avatar", response_model=PetResponse)
async def upload_avatar(
    pet_id: uuid.UUID,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise BadRequestException(detail="No file provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise BadRequestException(detail=f"File type {ext} not allowed")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise BadRequestException(detail="File size exceeds 5MB limit")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{pet_id}{ext}"
    filepath = UPLOAD_DIR / filename
    filepath.write_bytes(content)

    avatar_url = f"/uploads/{filename}"
    return await pet_service.update_pet(
        db, pet_id, PetUpdate(avatar_url=avatar_url)
    )
