import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { weightApi } from '../../api/health'
import type { WeightLog } from '../../types/health'

interface WeightChartProps {
  petId: string
}

const today = () => new Date().toISOString().split('T')[0]

function WeightChart({ petId }: WeightChartProps) {
  const [logs, setLogs] = useState<WeightLog[]>([])
  const [loading, setLoading] = useState(true)
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(today())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    weightApi
      .list(petId)
      .then(setLogs)
      .catch(() => setError('加载体重记录失败'))
      .finally(() => setLoading(false))
  }, [petId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(weight)
    if (!value || value <= 0) {
      setError('请输入有效体重')
      return
    }
    setError(null)
    setSaving(true)
    try {
      const created = await weightApi.create(petId, { weight: value, date })
      setLogs((prev) =>
        [...prev, created].sort((a, b) => a.date.localeCompare(b.date)),
      )
      setWeight('')
    } catch {
      setError('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await weightApi.delete(id)
      setLogs((prev) => prev.filter((l) => l.id !== id))
    } catch {
      setError('删除失败')
    }
  }

  const chartData = logs.map((l) => ({ date: l.date, weight: l.weight }))

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-100 bg-white/60 p-4"
      >
        <div>
          <label className="mb-1 block text-xs text-slate-500">体重 (kg)</label>
          <input
            type="number"
            step="0.01"
            min="0.1"
            max="200"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">日期</label>
          <input
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? '记录中...' : '记录体重'}
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading ? (
        <div className="py-10 text-center text-slate-400">加载中...</div>
      ) : chartData.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400">
          暂无体重记录，添加后可查看变化趋势
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-white/60 p-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  domain={['auto', 'auto']}
                  unit="kg"
                  width={56}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} kg`, '体重']}
                  contentStyle={{ borderRadius: 12, fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0ea5e9' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-white/60 p-4">
          <p className="mb-2 text-xs text-slate-400">体重记录</p>
          <ul className="divide-y divide-slate-100">
            {[...logs]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-slate-500">{log.date}</span>
                  <span className="font-medium text-slate-800">
                    {log.weight} kg
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(log.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    删除
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default WeightChart
