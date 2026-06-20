"""Health record and weight log API routes."""

import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException
from app.db.session import get_db
from app.schemas.health import (
    HealthRecordCreate,
    HealthRecordResponse,
    HealthRecordUpdate,
    WeightLogCreate,
    WeightLogResponse,
)
from app.services import health as health_service

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "health"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post(
    "/pets/{pet_id}/health-records",
    response_model=HealthRecordResponse,
    status_code=201,
    tags=["health-records"],
)
async def create_health_record(
    pet_id: uuid.UUID,
    data: HealthRecordCreate,
    db: AsyncSession = Depends(get_db),
):
    return await health_service.create_record(db, pet_id, data)


@router.get(
    "/pets/{pet_id}/health-records",
    response_model=list[HealthRecordResponse],
    tags=["health-records"],
)
async def list_health_records(
    pet_id: uuid.UUID,
    type: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    return await health_service.get_records_by_pet(db, pet_id, type)


@router.get(
    "/health-records/{record_id}",
    response_model=HealthRecordResponse,
    tags=["health-records"],
)
async def get_health_record(
    record_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    return await health_service.get_record(db, record_id)


@router.put(
    "/health-records/{record_id}",
    response_model=HealthRecordResponse,
    tags=["health-records"],
)
async def update_health_record(
    record_id: uuid.UUID,
    data: HealthRecordUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await health_service.update_record(db, record_id, data)


@router.delete(
    "/health-records/{record_id}",
    status_code=204,
    tags=["health-records"],
)
async def delete_health_record(
    record_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    await health_service.delete_record(db, record_id)


@router.post(
    "/health-records/{record_id}/attachments",
    response_model=HealthRecordResponse,
    tags=["health-records"],
)
async def upload_attachment(
    record_id: uuid.UUID,
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
        raise BadRequestException(detail="File size exceeds 10MB limit")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{record_id}_{uuid.uuid4().hex}{ext}"
    filepath = UPLOAD_DIR / filename
    filepath.write_bytes(content)

    url = f"/uploads/health/{filename}"
    return await health_service.add_attachment(db, record_id, url)


@router.post(
    "/pets/{pet_id}/weight-logs",
    response_model=WeightLogResponse,
    status_code=201,
    tags=["weight-logs"],
)
async def create_weight_log(
    pet_id: uuid.UUID,
    data: WeightLogCreate,
    db: AsyncSession = Depends(get_db),
):
    return await health_service.create_weight_log(db, pet_id, data)


@router.get(
    "/pets/{pet_id}/weight-logs",
    response_model=list[WeightLogResponse],
    tags=["weight-logs"],
)
async def list_weight_logs(
    pet_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    return await health_service.get_weight_logs_by_pet(db, pet_id)


@router.delete(
    "/weight-logs/{log_id}",
    status_code=204,
    tags=["weight-logs"],
)
async def delete_weight_log(
    log_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    await health_service.delete_weight_log(db, log_id)
