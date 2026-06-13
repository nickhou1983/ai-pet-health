import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { PetInfo } from '../api/consultation'
import ConsultationCard from '../components/consultation/ConsultationCard'
import PetSelector from '../components/consultation/PetSelector'
import { useConsultationStore } from '../stores/consultationStore'

function ConsultationListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const showCreator = location.pathname === '/consultation/new'
  const [submitting, setSubmitting] = useState(false)

  const {
    consultations,
    error,
    loading,
    fetchConsultations,
    createConsultation,
  } = useConsultationStore((state) => ({
    consultations: state.consultations,
    error: state.error,
    loading: state.loading,
    fetchConsultations: state.fetchConsultations,
    createConsultation: state.createConsultation,
  }))

  useEffect(() => {
    void fetchConsultations()
  }, [fetchConsultations])

  const metrics = useMemo(() => {
    const activeCount = consultations.filter((item) => item.status === 'active').length
    const urgentCount = consultations.filter((item) =>
      ['high', 'critical'].includes(item.urgency_level),
    ).length
    return {
      total: consultations.length,
      activeCount,
      urgentCount,
    }
  }, [consultations])

  const handleCreate = async (petInfo: PetInfo) => {
    setSubmitting(true)
    try {
      const consultation = await createConsultation({
        title: `${petInfo.name} 的问诊`,
        pet_info: petInfo,
      })
      navigate(`/consultation/${consultation.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="overflow-hidden rounded-[36px] border border-white/80 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(244,248,252,0.92))] p-6 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.5)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-500">
              Pet Health Concierge
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-none text-slate-900 sm:text-6xl">
              把零散症状，整理成一场更清晰的 AI 宠物问诊。
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-500">
              建立宠物档案后即可开始对话。AI 会持续评估风险等级、整理病情线索，并在结束时生成结构化护理建议与下一步行动清单。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/consultation/new')}
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                新建问诊
              </button>
              <button
                type="button"
                onClick={() => void fetchConsultations()}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-white"
              >
                刷新列表
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] border border-white/70 bg-white/75 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">总问诊数</p>
              <p className="mt-3 font-display text-5xl text-slate-900">{metrics.total}</p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/75 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">进行中</p>
              <p className="mt-3 font-display text-5xl text-slate-900">{metrics.activeCount}</p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/75 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">高优先级</p>
              <p className="mt-3 font-display text-5xl text-slate-900">{metrics.urgentCount}</p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[24px] border border-rose-100 bg-rose-50/80 px-5 py-4 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-[28px] border border-white/70 bg-white/60"
            />
          ))}
        </div>
      ) : consultations.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {consultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/65 px-6 py-12 text-center shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-500">暂无记录</p>
          <h2 className="mt-4 font-display text-4xl text-slate-800">暂无问诊记录</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            为宠物创建第一份 AI 问诊档案，后续的聊天记录、风险等级与报告都会在这里持续沉淀。
          </p>
          <button
            type="button"
            onClick={() => navigate('/consultation/new')}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            立即开始
          </button>
        </div>
      )}

      {showCreator ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <PetSelector
              loading={submitting}
              onSubmit={handleCreate}
              onCancel={() => navigate('/consultations')}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ConsultationListPage
