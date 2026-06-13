import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface StreamingTextProps {
  content: string
}

function StreamingText({ content }: StreamingTextProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-3xl rounded-[28px] rounded-bl-md border border-dashed border-brand-200 bg-white/88 px-5 py-4 text-slate-700 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.4)] backdrop-blur">
        <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-brand-500">
          <span>AI 问诊</span>
          <span>·</span>
          <span>正在分析</span>
        </div>
        <div className="consultation-markdown text-[15px] leading-7 text-slate-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '正在根据症状整理建议，请稍候…'}
          </ReactMarkdown>
          <span className="ml-1 inline-block h-5 w-2 animate-pulse rounded-full bg-brand-500 align-middle" />
        </div>
      </div>
    </div>
  )
}

export default StreamingText
