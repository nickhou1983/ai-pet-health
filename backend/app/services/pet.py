"""Pet service — CRUD operations."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.pet import Pet
from app.schemas.pet import PetCreate, PetUpdate


async def create_pet(db: AsyncSession, user_id: uuid.UUID, data: PetCreate) -> Pet:
    pet = Pet(user_id=user_id, **data.model_dump())
    db.add(pet)
    await db.flush()
    await db.refresh(pet)
    return pet


async def get_pet(db: AsyncSession, pet_id: uuid.UUID) -> Pet:
    result = await db.execute(select(Pet).where(Pet.id == pet_id))
    pet = result.scalar_one_or_none()
    if not pet:
        raise NotFoundException(detail="Pet not found")
    return pet


async def get_pets_by_user(db: AsyncSession, user_id: uuid.UUID) -> list[Pet]:
    result = await db.execute(
        select(Pet).where(Pet.user_id == user_id).order_by(Pet.created_at.desc())
    )
    return list(result.scalars().all())


async def update_pet(
    db: AsyncSession, pet_id: uuid.UUID, data: PetUpdate
) -> Pet:
    pet = await get_pet(db, pet_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pet, field, value)
    await db.flush()
    await db.refresh(pet)
    return pet


async def delete_pet(db: AsyncSession, pet_id: uuid.UUID) -> None:
    pet = await get_pet(db, pet_id)
    await db.delete(pet)
    await db.flush()
