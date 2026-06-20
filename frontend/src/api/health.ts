import { apiClient } from './client'
import type {
  HealthRecord,
  HealthRecordCreate,
  HealthRecordUpdate,
  RecordType,
  WeightLog,
  WeightLogCreate,
} from '../types/health'

export const healthApi = {
  list: (petId: string, type?: RecordType) =>
    apiClient
      .get<HealthRecord[]>(`/api/pets/${petId}/health-records`, {
        params: type ? { type } : {},
      })
      .then((r) => r.data),

  get: (recordId: string) =>
    apiClient
      .get<HealthRecord>(`/api/health-records/${recordId}`)
      .then((r) => r.data),

  create: (petId: string, data: HealthRecordCreate) =>
    apiClient
      .post<HealthRecord>(`/api/pets/${petId}/health-records`, data)
      .then((r) => r.data),

  update: (recordId: string, data: HealthRecordUpdate) =>
    apiClient
      .put<HealthRecord>(`/api/health-records/${recordId}`, data)
      .then((r) => r.data),

  delete: (recordId: string) =>
    apiClient.delete(`/api/health-records/${recordId}`),

  uploadAttachment: (recordId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post<HealthRecord>(`/api/health-records/${recordId}/attachments`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}

export const weightApi = {
  list: (petId: string) =>
    apiClient
      .get<WeightLog[]>(`/api/pets/${petId}/weight-logs`)
      .then((r) => r.data),

  create: (petId: string, data: WeightLogCreate) =>
    apiClient
      .post<WeightLog>(`/api/pets/${petId}/weight-logs`, data)
      .then((r) => r.data),

  delete: (logId: string) =>
    apiClient.delete(`/api/weight-logs/${logId}`),
}
