import type { HealthRecord } from '../../types/health'
import { RECORD_TYPE_META } from './recordTypes'

interface HealthTimelineProps {
  records: HealthRecord[]
  onSelect: (record: HealthRecord) => void
}

function HealthTimeline({ records, onSelect }: HealthTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400">
        暂无健康记录
      </div>
    )
  }

  return (
    <ol className="relative ml-3 border-l-2 border-slate-100">
      {records.map((record) => {
        const meta = RECORD_TYPE_META[record.type]
        return (
          <li key={record.id} className="mb-5 ml-6">
            <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm ring-2 ring-slate-100">
              {meta.icon}
            </span>
            <button
              type="button"
              onClick={() => onSelect(record)}
              className="w-full rounded-xl border border-slate-100 bg-white/70 p-4 text-left shadow-sm transition-colors hover:border-brand-200 hover:bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                  <span className="font-medium text-slate-900">
                    {record.title}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {record.date}
                </span>
              </div>
              {record.hospital && (
                <p className="mt-1 text-xs text-slate-500">🏥 {record.hospital}</p>
              )}
              {record.next_date && (
                <p className="mt-1 text-xs text-amber-600">
                  ⏰ 下次：{record.next_date}
                </p>
              )}
              {record.attachments && record.attachments.length > 0 && (
                <p className="mt-1 text-xs text-slate-400">
                  📎 {record.attachments.length} 个附件
                </p>
              )}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default HealthTimeline
