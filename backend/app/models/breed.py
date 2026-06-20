"""Breed database model."""

from sqlalchemy import Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Breed(Base):
    __tablename__ = "breeds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    species: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    name_cn: Mapped[str] = mapped_column(String(100), nullable=False)
    size: Mapped[str | None] = mapped_column(String(20), nullable=True)
    life_expectancy: Mapped[str | None] = mapped_column(String(50), nullable=True)
    common_diseases: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
