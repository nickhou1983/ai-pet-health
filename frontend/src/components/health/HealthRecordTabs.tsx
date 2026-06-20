import { useEffect, useState } from 'react'
import { healthApi } from '../../api/health'
import type {
  HealthRecord,
  HealthRecordCreate,
  RecordType,
} from '../../types/health'
import AttachmentUpload from './AttachmentUpload'
import HealthRecordDetail from './HealthRecordDetail'
import HealthRecordForm from './HealthRecordForm'
import HealthTimeline from './HealthTimeline'
import Modal from './Modal'
import { RECORD_TYPES, RECORD_TYPE_META } from './recordTypes'

interface HealthRecordTabsProps {
  petId: string
}

type Filter = 'all' | RecordType

function HealthRecordTabs({ petId }: HealthRecordTabsProps) {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<HealthRecord | null>(null)
  const [selected, setSelected] = useState<HealthRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    healthApi
      .list(petId)
      .then(setRecords)
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }, [petId])

  const visible =
    filter === 'all' ? records : records.filter((r) => r.type === filter)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleSubmit = async (data: HealthRecordCreate) => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await healthApi.update(editing.id, data)
        setRecords((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        )
      } else {
        const created = await healthApi.create(petId, data)
        setRecords((prev) =>
          [created, ...prev].sort((a, b) => b.date.localeCompare(a.date)),
        )
      }
      setFormOpen(false)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected || !window.confirm('确定要删除这条记录吗？')) return
    setDeleting(true)
    try {
      await healthApi.delete(selected.id)
      setRecords((prev) => prev.filter((r) => r.id !== selected.id))
      setSelected(null)
    } finally {
      setDeleting(false)
    }
  }

  const handleUpload = async (file: File) => {
    if (!selected) return
    const updated = await healthApi.uploadAttachment(selected.id, file)
    setSelected(updated)
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  const startEditFromDetail = () => {
    if (!selected) return
    setEditing(selected)
    setSelected(null)
    setFormOpen(true)
  }

  const countFor = (t: RecordType) =>
    records.filter((r) => r.type === t).length

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <FilterTab
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label={`全部 (${records.length})`}
          />
          {RECORD_TYPES.map((t) => (
            <FilterTab
              key={t}
              active={filter === t}
              onClick={() => setFilter(t)}
              label={`${RECORD_TYPE_META[t].icon} ${RECORD_TYPE_META[t].label} (${countFor(t)})`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + 添加记录
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-400">加载中...</div>
      ) : (
        <HealthTimeline records={visible} onSelect={setSelected} />
      )}

      <Modal
        open={formOpen}
        title={editing ? '编辑健康记录' : '添加健康记录'}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      >
        <HealthRecordForm
          petId={petId}
          initialData={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          loading={saving}
        />
      </Modal>

      <Modal
        open={Boolean(selected)}
        title="记录详情"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <HealthRecordDetail
            record={selected}
            onEdit={startEditFromDetail}
            onDelete={handleDelete}
            deleting={deleting}
            uploadSlot={<AttachmentUpload onUpload={handleUpload} />}
          />
        )}
      </Modal>
    </div>
  )
}

function FilterTab({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-950 text-white'
          : 'bg-white/70 text-slate-600 hover:bg-white'
      }`}
    >
      {label}
    </button>
  )
}

export default HealthRecordTabs
