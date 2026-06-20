import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '../../api/consultation'

interface MessageBubbleProps {
  message: Message
}

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
})

function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center">
        <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-500 shadow-sm backdrop-blur">
          {message.content}
        </div>
      </div>
    )
  }

  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-3xl rounded-[28px] px-5 py-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.4)] transition-transform duration-300',
          isUser
            ? 'rounded-br-md bg-brand-600 text-white'
            : 'rounded-bl-md border border-white/70 bg-white/92 text-slate-700 backdrop-blur',
        ].join(' ')}
      >
        <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-current/70">
          <span>{isUser ? '你' : 'AI 问诊'}</span>
          <span>·</span>
          <span>{timeFormatter.format(new Date(message.created_at))}</span>
        </div>

        {isUser ? (
          <p className="whitespace-pre-wrap text-[15px] leading-7">{message.content}</p>
        ) : (
          <div className="consultation-markdown text-[15px] leading-7 text-slate-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
