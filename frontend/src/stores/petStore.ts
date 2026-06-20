import { create } from 'zustand'
import type { Pet } from '../types/pet'
import { petApi } from '../api/pets'

interface PetState {
  pets: Pet[]
  loading: boolean
  error: string | null
  fetchPets: () => Promise<void>
  addPet: (pet: Pet) => void
  updatePet: (pet: Pet) => void
  removePet: (id: string) => void
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  loading: false,
  error: null,

  fetchPets: async () => {
    set({ loading: true, error: null })
    try {
      const pets = await petApi.list()
      set({ pets, loading: false })
    } catch {
      set({ error: 'Failed to load pets', loading: false })
    }
  },

  addPet: (pet) =>
    set((state) => ({ pets: [pet, ...state.pets] })),

  updatePet: (pet) =>
    set((state) => ({
      pets: state.pets.map((p) => (p.id === pet.id ? pet : p)),
    })),

  removePet: (id) =>
    set((state) => ({
      pets: state.pets.filter((p) => p.id !== id),
    })),
}))
