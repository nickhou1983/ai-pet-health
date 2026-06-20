"""Breed schemas for response validation."""

from pydantic import BaseModel


class BreedResponse(BaseModel):
    id: int
    species: str
    name: str
    name_cn: str
    size: str | None
    life_expectancy: str | None
    common_diseases: list[str] | None
    description: str | None

    model_config = {"from_attributes": True}
