import { useState } from 'react'
import type { PetInfo } from '../../api/consultation'

interface PetSelectorProps {
  loading?: boolean
  onSubmit: (petInfo: PetInfo) => Promise<void> | void
  onCancel?: () => void
}

const defaultPetInfo: PetInfo = {
  name: '',
  species: 'dog',
  breed: '',
  age: '',
  weight: '',
}

function PetSelector({ loading = false, onSubmit, onCancel }: PetSelectorProps) {
  const [petInfo, setPetInfo] = useState<PetInfo>(defaultPetInfo)

  const updateField = (field: keyof PetInfo, value: string) => {
    setPetInfo((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!petInfo.name.trim() || !petInfo.breed.trim()) return
    await onSubmit({
      ...petInfo,
      name: petInfo.name.trim(),
      breed: petInfo.breed.trim(),
      age: petInfo.age.trim(),
      weight: petInfo.weight.trim(),
    })
  }

  return (
    <div className="rounded-[32px] border border-white/80 bg-white p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-500">新建问诊</p>
        <h2 className="mt-3 font-display text-4xl text-slate-800">先建立宠物档案</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          这些信息会帮助 AI 更准确地判断症状背景与风险等级。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-600">宠物名字</label>
          <input
            value={petInfo.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="例如：豆包"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-200 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">宠物类型</label>
          <select
            value={petInfo.species}
            onChange={(event) => updateField('species', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-200 focus:bg-white"
          >
            <option value="dog">狗狗</option>
            <option value="cat">猫咪</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">品种</label>
          <input
            value={petInfo.breed}
            onChange={(event) => updateField('breed', event.target.value)}
            placeholder="例如：英短、柯基"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-200 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">年龄</label>
          <input
            value={petInfo.age}
            onChange={(event) => updateField('age', event.target.value)}
            placeholder="例如：3 岁 / 8 个月"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-200 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">体重</label>
          <input
            value={petInfo.weight}
            onChange={(event) => updateField('weight', event.target.value)}
            placeholder="例如：4.2kg"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-200 focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            取消
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={loading || !petInfo.name.trim() || !petInfo.breed.trim()}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? '创建中…' : '开始问诊'}
        </button>
      </div>
    </div>
  )
}

export default PetSelector
