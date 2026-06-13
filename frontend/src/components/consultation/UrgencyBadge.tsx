import type { Consultation } from '../../api/consultation'

interface UrgencyBadgeProps {
  level: Consultation['urgency_level']
  large?: boolean
}

const urgencyStyles: Record<Consultation['urgency_level'], { label: string; tone: string }> = {
  none: {
    label: '待评估',
    tone: 'border-slate-200 bg-slate-100/80 text-slate-600',
  },
  low: {
    label: '低风险',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  medium: {
    label: '中风险',
    tone: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  high: {
    label: '高风险',
    tone: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  critical: {
    label: '紧急',
    tone: 'border-rose-200 bg-rose-50 text-rose-700',
  },
}

function UrgencyBadge({ level, large = false }: UrgencyBadgeProps) {
  const current = urgencyStyles[level]

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border font-medium tracking-[0.16em] uppercase',
        large ? 'px-3 py-1 text-xs' : 'px-2.5 py-1 text-[10px]',
        current.tone,
      ].join(' ')}
    >
      {current.label}
    </span>
  )
}

export default UrgencyBadge
