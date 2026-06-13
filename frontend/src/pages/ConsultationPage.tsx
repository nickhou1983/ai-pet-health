import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChatInput from '../components/consultation/ChatInput'
import ChatWindow from '../components/consultation/ChatWindow'
import UrgencyBadge from '../components/consultation/UrgencyBadge'
import { useConsultationStore } from '../stores/consultationStore'

const speciesLabels: Record<string, string> = {
  dog: '狗狗',
  cat: '猫咪',
  other: '其他',
}

function ConsultationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    currentConsultation,
    messages,
    isStreaming,
    streamingContent,
    loading,
    error,
    selectConsultation,
    sendMessage,
    closeConsultation,
  } = useConsultationStore((state) => ({
    currentConsultation: state.currentConsultation,
    messages: state.messages,
    isStreaming: state.isStreaming,
    streamingContent: state.streamingContent,
    loading: state.loading,
    error: state.error,
    selectConsultation: state.selectConsultation,
    sendMessage: state.sendMessage,
    closeConsultation: state.closeConsultation,
  }))

  useEffect(() => {
    if (!id) return
    void selectConsultation(id)
  }, [id, selectConsultation])

  if (!id) {
    return null
  }

  const isCurrentConsultation = currentConsultation?.id === id

  if (loading && !isCurrentConsultation) {
    return (
      <div className="mx-auto grid w-full max-w-6xl gap-4">
        <div className="h-36 animate-pulse rounded-[32px] border border-white/70 bg-white/60" />
        <div className="h-[520px] animate-pulse rounded-[32px] border border-white/70 bg-white/60" />
      </div>
    )
  }

  if (!isCurrentConsultation) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-500">问诊不存在</p>
        <h1 className="mt-4 font-display text-5xl text-slate-900">没有找到这场问诊</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          {error || '记录可能已被删除，或者链接尚未同步。'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/consultations')}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          返回问诊列表
        </button>
      </div>
    )
  }

  const petInfo = currentConsultation.pet_info
  const reportDisabled = messages.length === 0 && !streamingContent
  const chatDisabled = currentConsultation.status === 'closed' || isStreaming

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <section className="rounded-[34px] border border-white/80 bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.18),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,248,252,0.92))] p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-500">正在问诊</p>
              <UrgencyBadge level={currentConsultation.urgency_level} large />
            </div>
            <h1 className="mt-4 font-display text-5xl leading-none text-slate-900 sm:text-6xl">
              {currentConsultation.title}
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-500">
              {petInfo
                ? `${petInfo.name} · ${speciesLabels[petInfo.species] || petInfo.species} · ${petInfo.breed} · ${petInfo.age || '年龄未填写'} · ${petInfo.weight || '体重未填写'}`
                : '请持续补充症状发生时间、食欲、精神状态与排泄情况，帮助 AI 更完整地判断。'}
            </p>
            {currentConsultation.status === 'closed' ? (
              <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-100/80 px-4 py-2 text-sm text-slate-500">
                这场问诊已结束，如需继续交流请新建问诊。
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              type="button"
              onClick={() => navigate(`/consultation/${id}/report`)}
              disabled={reportDisabled}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              生成报告
            </button>
            <button
              type="button"
              onClick={() => void closeConsultation()}
              disabled={currentConsultation.status === 'closed' || loading}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
            >
              结束问诊
            </button>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[24px] border border-rose-100 bg-rose-50/80 px-5 py-4 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex min-h-[680px] flex-col gap-4">
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onSuggestionClick={(suggestion) => {
              if (chatDisabled || currentConsultation.status === 'closed') return
              void sendMessage(suggestion)
            }}
          />
          <ChatInput
            disabled={chatDisabled || currentConsultation.status === 'closed'}
            placeholder={
              currentConsultation.status === 'closed'
                ? '当前问诊已结束'
                : '描述您宠物的症状...'
            }
            onSend={sendMessage}
          />
        </div>

        <aside className="grid gap-4 self-start">
          <div className="rounded-[30px] border border-white/80 bg-white/85 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-500">问诊提示</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-500">
              <li>• 描述症状开始的时间、持续时长和变化趋势。</li>
              <li>• 补充食欲、喝水量、精神状态、排便排尿情况。</li>
              <li>• 如出现抽搐、呼吸急促、失去意识，请立即线下就医。</li>
            </ul>
          </div>
          <div className="rounded-[30px] border border-white/80 bg-brand-950/90 p-5 text-brand-50 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)]">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-200">护宠原则</p>
            <h2 className="mt-3 font-display text-3xl leading-none">
              对话越完整，结论越可靠。
            </h2>
            <p className="mt-4 text-sm leading-6 text-brand-100/85">
              AI 会根据聊天历史给出初步判断，但不会替代专业检查。若症状快速加重，请优先联系线下兽医。
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ConsultationPage
