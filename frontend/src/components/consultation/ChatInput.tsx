import { useState, type KeyboardEvent } from 'react'

interface ChatInputProps {
  disabled?: boolean
  placeholder?: string
  onSend: (content: string) => Promise<void> | void
}

function ChatInput({
  disabled = false,
  placeholder = '描述您宠物的症状...',
  onSend,
}: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = async () => {
    const trimmedValue = value.trim()
    if (!trimmedValue || disabled) return
    await onSend(trimmedValue)
    setValue('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSubmit()
    }
  }

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/90 p-3 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <label className="sr-only" htmlFor="consultation-input">
          问诊输入框
        </label>
        <textarea
          id="consultation-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className="min-h-[96px] w-full resize-none rounded-[20px] border border-transparent bg-slate-50 px-4 py-3 text-[15px] leading-7 text-slate-700 outline-none transition focus:border-brand-200 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={disabled || !value.trim()}
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 md:min-w-[128px]"
        >
          {disabled ? 'AI 回复中…' : '发送消息'}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between px-1 text-xs text-slate-400">
        <span>Enter 发送，Shift + Enter 换行</span>
        <span>AI 建议仅供参考，请结合线下兽医判断</span>
      </div>
    </div>
  )
}

export default ChatInput
