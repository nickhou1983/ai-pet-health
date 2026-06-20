"""Breed service — query operations."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.breed import Breed


async def get_breeds(
    db: AsyncSession, species: str | None = None
) -> list[Breed]:
    query = select(Breed).order_by(Breed.species, Breed.name)
    if species:
        query = query.where(Breed.species == species)
    result = await db.execute(query)
    return list(result.scalars().all())
