export type RecordType =
  | 'vaccine'
  | 'deworming'
  | 'checkup'
  | 'medical'
  | 'surgery'

export interface HealthRecord {
  id: string
  pet_id: string
  type: RecordType
  title: string
  date: string
  next_date: string | null
  hospital: string | null
  doctor: string | null
  diagnosis: string | null
  medication: string | null
  notes: string | null
  attachments: string[] | null
  created_at: string
  updated_at: string
}

export interface HealthRecordCreate {
  type: RecordType
  title: string
  date: string
  next_date?: string | null
  hospital?: string | null
  doctor?: string | null
  diagnosis?: string | null
  medication?: string | null
  notes?: string | null
  attachments?: string[] | null
}

export type HealthRecordUpdate = Partial<HealthRecordCreate>

export interface WeightLog {
  id: string
  pet_id: string
  weight: number
  date: string
  created_at: string
}

export interface WeightLogCreate {
  weight: number
  date: string
}
