import { useRef } from 'react'

interface AvatarUploadProps {
  avatarUrl: string | null
  onUpload: (file: File) => void
  species?: string
}

const speciesEmoji: Record<string, string> = {
  dog: '🐕',
  cat: '🐈',
  other: '🐾',
}

function AvatarUpload({ avatarUrl, onUpload, species = 'other' }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-primary-300 hover:border-primary-500 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Pet avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <span className="text-3xl">{speciesEmoji[species] || '🐾'}</span>
            <p className="text-xs text-primary-500 mt-1">上传头像</p>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

export default AvatarUpload
