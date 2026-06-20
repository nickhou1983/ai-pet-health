import { Link } from 'react-router-dom'
import type { Consultation } from '../../api/consultation'
import UrgencyBadge from './UrgencyBadge'

interface ConsultationCardProps {
  consultation: Consultation
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const speciesLabels: Record<string, string> = {
  dog: '狗狗',
  cat: '猫咪',
  other: '其他',
}

function ConsultationCard({ consultation }: ConsultationCardProps) {
  const preview =
    consultation.last_message_preview?.trim() ||
    (consultation.pet_info
      ? `${consultation.pet_info.name} · ${speciesLabels[consultation.pet_info.species] || consultation.pet_info.species} · ${consultation.pet_info.breed}`
      : '等待首次症状描述')

  return (
    <Link
      to={`/consultation/${consultation.id}`}
      className="group block rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-[0_28px_80px_-38px_rgba(14,165,233,0.5)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-display text-3xl text-slate-800">
              {consultation.title || `${consultation.pet_info?.name || '宠物'} 的问诊`}
            </h3>
            <UrgencyBadge level={consultation.urgency_level} />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
            {preview}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>
              {consultation.message_count ? `共 ${consultation.message_count} 条消息` : '尚未开始对话'}
            </span>
            <span>·</span>
            <span>{dateFormatter.format(new Date(consultation.updated_at))}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span
            className={[
              'rounded-full px-3 py-1 text-xs font-medium',
              consultation.status === 'active'
                ? 'bg-brand-50 text-brand-600'
                : 'bg-slate-100 text-slate-500',
            ].join(' ')}
          >
            {consultation.status === 'active' ? '进行中' : '已结束'}
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-brand-500 transition group-hover:translate-x-1">
            进入问诊 →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ConsultationCard
