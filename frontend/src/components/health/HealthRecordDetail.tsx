import type { HealthRecord } from '../../types/health'
import { RECORD_TYPE_META } from './recordTypes'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

function AttachmentItem({ url }: { url: string }) {
  const fullUrl = `${API_BASE}${url}`
  if (isImage(url)) {
    return (
      <a href={fullUrl} target="_blank" rel="noreferrer">
        <img
          src={fullUrl}
          alt="检验报告"
          className="h-24 w-24 rounded-lg border border-slate-200 object-cover transition-opacity hover:opacity-80"
        />
      </a>
    )
  }
  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noreferrer"
      className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-center text-xs text-slate-600 hover:bg-slate-100"
    >
      <span className="text-2xl">📄</span>
      <span className="mt-1">查看 PDF</span>
    </a>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="whitespace-pre-wrap text-sm text-slate-800">{value}</span>
    </div>
  )
}

interface HealthRecordDetailProps {
  record: HealthRecord
  onEdit: () => void
  onDelete: () => void
  deleting?: boolean
  uploadSlot?: React.ReactNode
}

function HealthRecordDetail({
  record,
  onEdit,
  onDelete,
  deleting = false,
  uploadSlot,
}: HealthRecordDetailProps) {
  const meta = RECORD_TYPE_META[record.type]

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">{meta.icon}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.badge}`}
        >
          {meta.label}
        </span>
      </div>

      <h3 className="text-base font-semibold text-slate-900">{record.title}</h3>

      <div className="mt-3">
        <Field label="日期" value={record.date} />
        <Field label="下次日期" value={record.next_date} />
        <Field label="医院" value={record.hospital} />
        <Field label="医生" value={record.doctor} />
        <Field label="诊断 / 结果" value={record.diagnosis} />
        <Field label="用药 / 方式" value={record.medication} />
        <Field label="备注 / 症状" value={record.notes} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs text-slate-400">检验报告附件</p>
        {record.attachments && record.attachments.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {record.attachments.map((url) => (
              <AttachmentItem key={url} url={url} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">暂无附件</p>
        )}
        {uploadSlot && <div className="mt-3">{uploadSlot}</div>}
      </div>

      <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          编辑
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="flex-1 rounded-lg border border-red-300 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? '删除中...' : '删除'}
        </button>
      </div>
    </div>
  )
}

export default HealthRecordDetail
