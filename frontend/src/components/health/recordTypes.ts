import type { RecordType } from '../../types/health'

interface TypeMeta {
  label: string
  icon: string
  badge: string
}

export const RECORD_TYPE_META: Record<RecordType, TypeMeta> = {
  vaccine: { label: '疫苗', icon: '💉', badge: 'bg-emerald-100 text-emerald-700' },
  deworming: { label: '驱虫', icon: '🪱', badge: 'bg-amber-100 text-amber-700' },
  checkup: { label: '体检', icon: '🩺', badge: 'bg-brand-100 text-brand-700' },
  medical: { label: '病历', icon: '📋', badge: 'bg-rose-100 text-rose-700' },
  surgery: { label: '手术', icon: '🏥', badge: 'bg-purple-100 text-purple-700' },
}

export const RECORD_TYPES: RecordType[] = [
  'vaccine',
  'deworming',
  'checkup',
  'medical',
  'surgery',
]
