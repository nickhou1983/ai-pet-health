"""Health record and weight log service — CRUD operations."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.health import HealthRecord, WeightLog
from app.schemas.health import (
    HealthRecordCreate,
    HealthRecordUpdate,
    WeightLogCreate,
)


async def create_record(
    db: AsyncSession, pet_id: uuid.UUID, data: HealthRecordCreate
) -> HealthRecord:
    record = HealthRecord(pet_id=pet_id, **data.model_dump())
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def get_record(db: AsyncSession, record_id: uuid.UUID) -> HealthRecord:
    result = await db.execute(
        select(HealthRecord).where(HealthRecord.id == record_id)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise NotFoundException(detail="Health record not found")
    return record


async def get_records_by_pet(
    db: AsyncSession, pet_id: uuid.UUID, record_type: str | None = None
) -> list[HealthRecord]:
    query = select(HealthRecord).where(HealthRecord.pet_id == pet_id)
    if record_type:
        query = query.where(HealthRecord.type == record_type)
    query = query.order_by(HealthRecord.date.desc(), HealthRecord.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def update_record(
    db: AsyncSession, record_id: uuid.UUID, data: HealthRecordUpdate
) -> HealthRecord:
    record = await get_record(db, record_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
    await db.flush()
    await db.refresh(record)
    return record


async def delete_record(db: AsyncSession, record_id: uuid.UUID) -> None:
    record = await get_record(db, record_id)
    await db.delete(record)
    await db.flush()


async def add_attachment(
    db: AsyncSession, record_id: uuid.UUID, url: str
) -> HealthRecord:
    record = await get_record(db, record_id)
    attachments = list(record.attachments or [])
    attachments.append(url)
    record.attachments = attachments
    await db.flush()
    await db.refresh(record)
    return record


async def create_weight_log(
    db: AsyncSession, pet_id: uuid.UUID, data: WeightLogCreate
) -> WeightLog:
    log = WeightLog(pet_id=pet_id, **data.model_dump())
    db.add(log)
    await db.flush()
    await db.refresh(log)
    return log


async def get_weight_logs_by_pet(
    db: AsyncSession, pet_id: uuid.UUID
) -> list[WeightLog]:
    result = await db.execute(
        select(WeightLog)
        .where(WeightLog.pet_id == pet_id)
        .order_by(WeightLog.date.asc())
    )
    return list(result.scalars().all())


async def delete_weight_log(db: AsyncSession, log_id: uuid.UUID) -> None:
    result = await db.execute(select(WeightLog).where(WeightLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise NotFoundException(detail="Weight log not found")
    await db.delete(log)
    await db.flush()
