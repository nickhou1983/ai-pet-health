import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/client'

function HomePage() {
  const [status, setStatus] = useState<string>('loading...')

  useEffect(() => {
    apiClient
      .get('/api/health')
      .then((response) => {
        setStatus(response.data.status)
      })
      .catch(() => {
        setStatus('disconnected')
      })
  }, [])

  const statusTone = useMemo(() => {
    if (status === 'healthy') {
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    }
    if (status === 'loading...') {
      return 'border-amber-200 bg-amber-50 text-amber-700'
    }
    return 'border-rose-200 bg-rose-50 text-rose-600'
  }, [status])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="overflow-hidden rounded-[38px] border border-white/80 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,248,252,0.92))] p-6 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.55)] sm:p-8 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-500">Veterinary AI Companion</p>
            <h1 className="mt-4 font-display text-5xl leading-none text-slate-900 sm:text-6xl lg:text-7xl">
              让每次宠物不舒服，都有一份更冷静的应对方案。
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-500">
              从第一句症状描述开始，AI 会持续整理风险信号、生成护理建议，并最终输出结构化问诊报告，帮助你更快判断是否需要线下就医。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/consultations"
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                进入 AI 问诊
              </Link>
              <Link
                to="/consultation/new"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
              >
                为宠物创建首份档案
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/70 bg-white/75 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">核心能力</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• 实时流式 AI 对话，像和医生整理病情一样自然。</li>
                <li>• 自动识别风险等级，突出高危症状与行动优先级。</li>
                <li>• Markdown 报告输出，便于继续分享与追踪。</li>
              </ul>
            </div>
            <div className={`rounded-[28px] border p-5 ${statusTone}`}>
              <p className="text-xs uppercase tracking-[0.24em]">后端连接状态</p>
              <p className="mt-3 font-display text-4xl">{status}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: '症状收集',
            body: '引导记录宠物的年龄、体重、食欲、精神状态和排泄情况。',
          },
          {
            title: '风险评估',
            body: '对话过程中动态更新 urgency level，优先提醒紧急情况。',
          },
          {
            title: '结构化报告',
            body: '生成简洁可读的 Markdown 报告，方便复盘与转诊。',
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[30px] border border-white/75 bg-white/80 p-6 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Feature</p>
            <h2 className="mt-4 font-display text-4xl text-slate-900">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default HomePage
