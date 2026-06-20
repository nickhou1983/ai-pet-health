import { apiClient } from './client'
import type { Pet, PetCreate, PetUpdate, Breed } from '../types/pet'

export const petApi = {
  list: () =>
    apiClient.get<Pet[]>('/api/pets').then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Pet>(`/api/pets/${id}`).then((r) => r.data),

  create: (data: PetCreate) =>
    apiClient.post<Pet>('/api/pets', data).then((r) => r.data),

  update: (id: string, data: PetUpdate) =>
    apiClient.put<Pet>(`/api/pets/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/api/pets/${id}`),

  uploadAvatar: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post<Pet>(`/api/pets/${id}/avatar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}

export const breedApi = {
  list: (species?: string) =>
    apiClient
      .get<Breed[]>('/api/breeds', { params: species ? { species } : {} })
      .then((r) => r.data),
}
