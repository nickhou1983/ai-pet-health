import { useRef, useState } from 'react'

interface AttachmentUploadProps {
  onUpload: (file: File) => Promise<void>
  disabled?: boolean
}

const ACCEPT = '.jpg,.jpeg,.png,.gif,.webp,.pdf'
const MAX_SIZE = 10 * 1024 * 1024

function AttachmentUpload({ onUpload, disabled = false }: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    if (file.size > MAX_SIZE) {
      setError('文件大小超过 10MB 限制')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)
    try {
      await onUpload(file)
    } catch {
      setError('上传失败，请重试')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleChange}
        disabled={disabled || uploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-brand-300 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-50"
      >
        {uploading ? '上传中...' : '📎 上传检验报告 (图片/PDF)'}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default AttachmentUpload
