import { useState } from 'react'
import type {
  HealthRecord,
  HealthRecordCreate,
  RecordType,
} from '../../types/health'
import { RECORD_TYPES, RECORD_TYPE_META } from './recordTypes'

interface HealthRecordFormProps {
  petId: string
  initialData?: HealthRecord
  defaultType?: RecordType
  onSubmit: (data: HealthRecordCreate) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

type FieldKey =
  | 'next_date'
  | 'hospital'
  | 'doctor'
  | 'diagnosis'
  | 'medication'
  | 'notes'

interface FieldDef {
  key: FieldKey
  label: string
  type: 'text' | 'date' | 'textarea'
  placeholder?: string
}

const TITLE_LABEL: Record<RecordType, string> = {
  vaccine: '疫苗名称',
  deworming: '药品名称',
  checkup: '体检项目',
  medical: '病历标题',
  surgery: '手术名称',
}

const DATE_LABEL: Record<RecordType, string> = {
  vaccine: '接种日期',
  deworming: '驱虫日期',
  checkup: '体检日期',
  medical: '就诊日期',
  surgery: '手术日期',
}

const TYPE_FIELDS: Record<RecordType, FieldDef[]> = {
  vaccine: [
    { key: 'next_date', label: '下次接种日期', type: 'date' },
    { key: 'hospital', label: '接种医院', type: 'text', placeholder: '医院名称' },
    { key: 'notes', label: '备注', type: 'textarea' },
  ],
  deworming: [
    {
      key: 'medication',
      label: '驱虫方式',
      type: 'text',
      placeholder: '体内 / 体外 / 体内外',
    },
    { key: 'next_date', label: '下次驱虫日期', type: 'date' },
    { key: 'hospital', label: '医院', type: 'text', placeholder: '医院名称（可选）' },
    { key: 'notes', label: '备注', type: 'textarea' },
  ],
  checkup: [
    { key: 'hospital', label: '医院', type: 'text', placeholder: '医院名称' },
    { key: 'doctor', label: '医生', type: 'text', placeholder: '医生姓名' },
    {
      key: 'diagnosis',
      label: '检查结果',
      type: 'textarea',
      placeholder: '体重、体温、心率等检查指标与结论',
    },
    { key: 'notes', label: '备注', type: 'textarea' },
  ],
  medical: [
    { key: 'hospital', label: '医院', type: 'text', placeholder: '医院名称' },
    { key: 'doctor', label: '医生', type: 'text', placeholder: '医生姓名' },
    { key: 'diagnosis', label: '诊断', type: 'textarea', placeholder: '诊断结果' },
    { key: 'notes', label: '症状', type: 'textarea', placeholder: '症状描述' },
    { key: 'medication', label: '用药', type: 'textarea', placeholder: '用药情况' },
  ],
  surgery: [
    { key: 'hospital', label: '医院', type: 'text', placeholder: '医院名称' },
    { key: 'doctor', label: '主刀医生', type: 'text', placeholder: '医生姓名' },
    {
      key: 'diagnosis',
      label: '手术说明',
      type: 'textarea',
      placeholder: '手术原因与过程',
    },
    { key: 'next_date', label: '复查日期', type: 'date' },
    { key: 'notes', label: '备注', type: 'textarea' },
  ],
}

const today = () => new Date().toISOString().split('T')[0]

function HealthRecordForm({
  initialData,
  defaultType = 'vaccine',
  onSubmit,
  onCancel,
  loading = false,
}: HealthRecordFormProps) {
  const [form, setForm] = useState<HealthRecordCreate>({
    type: initialData?.type ?? defaultType,
    title: initialData?.title ?? '',
    date: initialData?.date ?? today(),
    next_date: initialData?.next_date ?? null,
    hospital: initialData?.hospital ?? null,
    doctor: initialData?.doctor ?? null,
    diagnosis: initialData?.diagnosis ?? null,
    medication: initialData?.medication ?? null,
    notes: initialData?.notes ?? null,
  })

  const update = <K extends keyof HealthRecordCreate>(
    key: K,
    value: HealthRecordCreate[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    onSubmit(form)
  }

  const fields = TYPE_FIELDS[form.type]
  const isEditing = Boolean(initialData)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            记录类型 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {RECORD_TYPES.map((t) => {
              const meta = RECORD_TYPE_META[t]
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => update('type', t)}
                  className={`flex flex-col items-center rounded-lg border-2 py-2 text-center text-sm transition-colors ${
                    form.type === t
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{meta.icon}</span>
                  <span className="mt-1">{meta.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {TITLE_LABEL[form.type]} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          maxLength={200}
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
          placeholder={TITLE_LABEL[form.type]}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {DATE_LABEL[form.type]} <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          required
          max={today()}
          value={form.date}
          onChange={(e) => update('date', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              rows={3}
              value={form[field.key] ?? ''}
              onChange={(e) => update(field.key, e.target.value || null)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
            />
          ) : (
            <input
              type={field.type}
              value={form[field.key] ?? ''}
              onChange={(e) => update(field.key, e.target.value || null)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
            />
          )}
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading || !form.title.trim()}
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? '保存中...' : isEditing ? '保存修改' : '添加记录'}
        </button>
      </div>
    </form>
  )
}

export default HealthRecordForm
