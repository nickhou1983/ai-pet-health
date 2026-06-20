export interface Pet {
  id: string
  user_id: string
  name: string
  species: 'cat' | 'dog' | 'other'
  breed: string | null
  gender: 'male' | 'female' | 'unknown'
  birthday: string | null
  weight: number | null
  is_neutered: boolean
  chip_number: string | null
  avatar_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PetCreate {
  name: string
  species: 'cat' | 'dog' | 'other'
  breed?: string | null
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string | null
  weight?: number | null
  is_neutered?: boolean
  chip_number?: string | null
  notes?: string | null
}

export interface PetUpdate {
  name?: string
  species?: 'cat' | 'dog' | 'other'
  breed?: string | null
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string | null
  weight?: number | null
  is_neutered?: boolean
  chip_number?: string | null
  avatar_url?: string | null
  notes?: string | null
}

export interface Breed {
  id: number
  species: 'cat' | 'dog' | 'other'
  name: string
  name_cn: string
  size: string | null
  life_expectancy: string | null
  common_diseases: string[] | null
  description: string | null
}
