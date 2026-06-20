"""create pets and breeds tables

Revision ID: 0001
Revises:
Create Date: 2026-06-20
"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pets",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("species", sa.String(length=20), nullable=False),
        sa.Column("breed", sa.String(length=100), nullable=True),
        sa.Column("gender", sa.String(length=20), nullable=False),
        sa.Column("birthday", sa.Date(), nullable=True),
        sa.Column("weight", sa.Float(), nullable=True),
        sa.Column("is_neutered", sa.Boolean(), nullable=False),
        sa.Column("chip_number", sa.String(length=50), nullable=True),
        sa.Column("avatar_url", sa.String(length=500), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_pets_user_id"), "pets", ["user_id"], unique=False)

    op.create_table(
        "breeds",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("species", sa.String(length=20), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("name_cn", sa.String(length=100), nullable=False),
        sa.Column("size", sa.String(length=20), nullable=True),
        sa.Column("life_expectancy", sa.String(length=50), nullable=True),
        sa.Column("common_diseases", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_breeds_species"), "breeds", ["species"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_breeds_species"), table_name="breeds")
    op.drop_table("breeds")
    op.drop_index(op.f("ix_pets_user_id"), table_name="pets")
    op.drop_table("pets")
