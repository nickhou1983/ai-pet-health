import { useState } from 'react'
import type { PetCreate } from '../../types/pet'
import BreedSelector from './BreedSelector'

interface PetFormProps {
  initialData?: Partial<PetCreate>
  onSubmit: (data: PetCreate) => void
  loading?: boolean
  submitLabel?: string
}

function PetForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = '保存',
}: PetFormProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<PetCreate>({
    name: initialData?.name || '',
    species: initialData?.species || 'dog',
    breed: initialData?.breed || null,
    gender: initialData?.gender || 'unknown',
    birthday: initialData?.birthday || null,
    weight: initialData?.weight || null,
    is_neutered: initialData?.is_neutered || false,
    chip_number: initialData?.chip_number || null,
    notes: initialData?.notes || null,
  })

  const updateField = <K extends keyof PetCreate>(key: K, value: PetCreate[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const steps = ['基本信息', '详细信息', '确认']

  return (
    <form onSubmit={handleSubmit}>
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8 gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                i <= step ? 'text-primary-600 font-medium' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`mx-3 w-12 h-0.5 ${
                  i < step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              宠物名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="给你的宠物取个名字"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              类型 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {(['dog', 'cat', 'other'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`flex-1 py-3 rounded-lg border-2 text-center transition-colors ${
                    form.species === s
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    updateField('species', s)
                    updateField('breed', null)
                  }}
                >
                  <span className="text-2xl block">
                    {s === 'dog' ? '🐕' : s === 'cat' ? '🐈' : '🐾'}
                  </span>
                  <span className="text-sm mt-1">
                    {s === 'dog' ? '狗狗' : s === 'cat' ? '猫咪' : '其他'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <BreedSelector
            species={form.species}
            value={form.breed ?? null}
            onChange={(breed) => updateField('breed', breed)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              性别
            </label>
            <div className="flex gap-3">
              {(['male', 'female', 'unknown'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`flex-1 py-2 rounded-lg border transition-colors text-sm ${
                    form.gender === g
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateField('gender', g)}
                >
                  {g === 'male' ? '♂ 公' : g === 'female' ? '♀ 母' : '未知'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              生日
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={form.birthday || ''}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) =>
                updateField('birthday', e.target.value || null)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              体重 (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="200"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.0"
              value={form.weight ?? ''}
              onChange={(e) =>
                updateField(
                  'weight',
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_neutered"
              className="w-4 h-4 text-primary-500 rounded"
              checked={form.is_neutered}
              onChange={(e) => updateField('is_neutered', e.target.checked)}
            />
            <label htmlFor="is_neutered" className="text-sm text-gray-700">
              已绝育
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              芯片号
            </label>
            <input
              type="text"
              maxLength={50}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="芯片编号（可选）"
              value={form.chip_number || ''}
              onChange={(e) =>
                updateField('chip_number', e.target.value || null)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="关于这只宠物的其他信息..."
              value={form.notes || ''}
              onChange={(e) => updateField('notes', e.target.value || null)}
            />
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 2 && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">确认信息</h3>
          <InfoRow label="名称" value={form.name} />
          <InfoRow
            label="类型"
            value={form.species === 'dog' ? '🐕 狗狗' : form.species === 'cat' ? '🐈 猫咪' : '🐾 其他'}
          />
          <InfoRow label="品种" value={form.breed || '未选择'} />
          <InfoRow
            label="性别"
            value={
              form.gender === 'male'
                ? '♂ 公'
                : form.gender === 'female'
                ? '♀ 母'
                : '未知'
            }
          />
          <InfoRow label="生日" value={form.birthday || '未填写'} />
          <InfoRow
            label="体重"
            value={form.weight ? `${form.weight}kg` : '未填写'}
          />
          <InfoRow label="绝育" value={form.is_neutered ? '是' : '否'} />
          <InfoRow label="芯片号" value={form.chip_number || '未填写'} />
          {form.notes && <InfoRow label="备注" value={form.notes} />}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => setStep(step - 1)}
          >
            上一步
          </button>
        ) : (
          <div />
        )}

        {step < 2 ? (
          <button
            type="button"
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            disabled={step === 0 && !form.name.trim()}
            onClick={() => setStep(step + 1)}
          >
            下一步
          </button>
        ) : (
          <button
            type="submit"
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '保存中...' : submitLabel}
          </button>
        )}
      </div>
    </form>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

export default PetForm
