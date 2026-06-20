"""create health_records and weight_logs tables

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-20
"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "health_records",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("pet_id", sa.Uuid(), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("next_date", sa.Date(), nullable=True),
        sa.Column("hospital", sa.String(length=200), nullable=True),
        sa.Column("doctor", sa.String(length=100), nullable=True),
        sa.Column("diagnosis", sa.Text(), nullable=True),
        sa.Column("medication", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("attachments", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
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
    op.create_index(
        op.f("ix_health_records_pet_id"), "health_records", ["pet_id"], unique=False
    )

    op.create_table(
        "weight_logs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("pet_id", sa.Uuid(), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_weight_logs_pet_id"), "weight_logs", ["pet_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_weight_logs_pet_id"), table_name="weight_logs")
    op.drop_table("weight_logs")
    op.drop_index(op.f("ix_health_records_pet_id"), table_name="health_records")
    op.drop_table("health_records")
