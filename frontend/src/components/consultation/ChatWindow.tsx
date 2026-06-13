import { useEffect, useRef } from 'react'
import type { Message } from '../../api/consultation'
import MessageBubble from './MessageBubble'
import StreamingText from './StreamingText'

interface ChatWindowProps {
  messages: Message[]
  isStreaming: boolean
  streamingContent: string
  onSuggestionClick?: (suggestion: string) => void
}

const suggestions = [
  '我家宠物今天精神不好，还伴随轻微呕吐，应该先观察什么？',
  '猫咪连续打喷嚏两天，需要尽快去医院吗？',
  '狗狗突然不愿意吃饭，但会喝水，我该怎么判断严重程度？',
]

function ChatWindow({
  messages,
  isStreaming,
  streamingContent,
  onSuggestionClick,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isStreaming, streamingContent])

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex h-full min-h-[420px] flex-col justify-between rounded-[32px] border border-white/70 bg-white/65 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-brand-500">
            AI 问诊室
          </p>
          <h2 className="mt-3 font-display text-4xl text-slate-800 sm:text-5xl">
            从症状描述开始，生成一场更有条理的宠物咨询。
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">
            先告诉我宠物的年龄、品种、精神状态、食欲与排泄情况。AI 会边对话边评估风险等级，并在结束后生成结构化报告。
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick?.(suggestion)}
              className="group rounded-[24px] border border-slate-200 bg-slate-50/85 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-[0_18px_50px_-38px_rgba(14,165,233,0.9)]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                推荐提问
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{suggestion}</p>
              <span className="mt-4 inline-flex items-center text-xs font-medium text-brand-500">
                直接发送 →
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full min-h-[420px] overflow-y-auto rounded-[32px] border border-white/70 bg-white/55 p-4 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isStreaming ? <StreamingText content={streamingContent} /> : null}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default ChatWindow
