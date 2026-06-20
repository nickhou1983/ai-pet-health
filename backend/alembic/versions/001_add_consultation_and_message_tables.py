"""add consultation and message tables

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "consultations",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.String(100), nullable=False),
        sa.Column("pet_id", sa.String(100), nullable=True),
        sa.Column("title", sa.String(200), nullable=False, server_default=sa.text("'新问诊'")),
        sa.Column(
            "status",
            sa.Enum("active", "closed", name="consultationstatus"),
            nullable=False,
            server_default=sa.text("'active'"),
        ),
        sa.Column(
            "urgency_level",
            sa.Enum("none", "low", "medium", "high", "critical", name="urgencylevel"),
            nullable=False,
            server_default=sa.text("'none'"),
        ),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("pet_info", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_consultations_user_id", "consultations", ["user_id"])

    op.create_table(
        "messages",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("consultation_id", sa.UUID(), nullable=False),
        sa.Column("role", sa.Enum("user", "assistant", "system", name="messagerole"), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["consultation_id"], ["consultations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_messages_consultation_id", "messages", ["consultation_id"])


def downgrade() -> None:
    op.drop_index("ix_messages_consultation_id", table_name="messages")
    op.drop_table("messages")
    op.drop_index("ix_consultations_user_id", table_name="consultations")
    op.drop_table("consultations")
    op.execute("DROP TYPE IF EXISTS messagerole")
    op.execute("DROP TYPE IF EXISTS consultationstatus")
    op.execute("DROP TYPE IF EXISTS urgencylevel")
