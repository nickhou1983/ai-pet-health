import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate, useParams } from 'react-router-dom'
import type { ConsultationReport } from '../api/consultation'
import UrgencyBadge from '../components/consultation/UrgencyBadge'
import { useConsultationStore } from '../stores/consultationStore'

function ConsultationReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<ConsultationReport | null>(null)
  const [reportLoading, setReportLoading] = useState(true)
  const [reportError, setReportError] = useState<string | null>(null)

  const { currentConsultation, selectConsultation, generateReport } = useConsultationStore(
    (state) => ({
      currentConsultation: state.currentConsultation,
      selectConsultation: state.selectConsultation,
      generateReport: state.generateReport,
    }),
  )

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const loadReport = async () => {
      setReportLoading(true)
      setReportError(null)

      try {
        await selectConsultation(id)
        const nextReport = await generateReport()
        if (!cancelled) {
          setReport(nextReport)
        }
      } catch (error) {
        if (!cancelled) {
          setReportError(
            error instanceof Error ? error.message : '生成报告时出现异常',
          )
        }
      } finally {
        if (!cancelled) {
          setReportLoading(false)
        }
      }
    }

    void loadReport()

    return () => {
      cancelled = true
    }
  }, [id, generateReport, selectConsultation])

  if (!id) return null

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <section className="rounded-[34px] border border-white/80 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,248,252,0.92))] p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-500">AI 问诊报告</p>
            <h1 className="mt-4 font-display text-5xl leading-none text-slate-900 sm:text-6xl">
              {currentConsultation?.title || '问诊报告'}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">
              汇总症状、风险等级和护理建议，方便与家人或线下兽医继续沟通。
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/consultation/${id}`)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-white"
          >
            返回对话
          </button>
        </div>
      </section>

      {reportLoading ? (
        <div className="grid gap-4">
          <div className="h-28 animate-pulse rounded-[28px] border border-white/70 bg-white/60" />
          <div className="h-[420px] animate-pulse rounded-[28px] border border-white/70 bg-white/60" />
        </div>
      ) : reportError ? (
        <div className="rounded-[28px] border border-rose-100 bg-rose-50/85 px-6 py-8 text-center text-rose-600 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
          <p className="text-sm">{reportError}</p>
          <button
            type="button"
            onClick={() => navigate(`/consultation/${id}`)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            返回问诊
          </button>
        </div>
      ) : report ? (
        <>
          <section className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">当前风险等级</p>
                <h2 className="mt-3 font-display text-4xl text-slate-900">
                  需要重点关注的医疗信号
                </h2>
              </div>
              <UrgencyBadge
                level={report.urgency_level as 'none' | 'low' | 'medium' | 'high' | 'critical'}
                large
              />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {report.recommendations.slice(0, 3).map((recommendation) => (
                <div
                  key={recommendation}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/85 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-brand-500">下一步</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{recommendation}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-500">结构化总结</p>
            <div className="consultation-markdown mt-5 text-[15px] leading-7 text-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report.report_content}
              </ReactMarkdown>
            </div>
          </section>

          {report.recommendations.length > 3 ? (
            <section className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-500">完整建议</p>
              <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                {report.recommendations.map((recommendation, index) => (
                  <li key={`${recommendation}-${index}`} className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
                      {index + 1}
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-slate-500">
          暂无可展示的报告内容。
        </div>
      )}
    </div>
  )
}

export default ConsultationReportPage
