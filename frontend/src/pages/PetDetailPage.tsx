import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { petApi } from '../api/pets'
import { usePetStore } from '../stores/petStore'
import AvatarUpload from '../components/pet/AvatarUpload'
import type { Pet } from '../types/pet'

function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { removePet, updatePet: updatePetInStore } = usePetStore()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    petApi
      .get(id)
      .then(setPet)
      .catch(() => navigate('/pets'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!id || !window.confirm('确定要删除这只宠物吗？此操作不可撤销。')) return
    setDeleting(true)
    try {
      await petApi.delete(id)
      removePet(id)
      navigate('/pets')
    } catch {
      setDeleting(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    if (!id) return
    try {
      const updated = await petApi.uploadAvatar(id, file)
      setPet(updated)
      updatePetInStore(updated)
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!pet) return null

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/pets" className="text-gray-400 hover:text-gray-600">
          ← 返回
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Avatar and name */}
        <div className="flex flex-col items-center mb-6">
          <AvatarUpload
            avatarUrl={pet.avatar_url}
            onUpload={handleAvatarUpload}
            species={pet.species}
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-3">{pet.name}</h1>
          <p className="text-gray-500 text-sm">
            {pet.breed || pet.species}
            {pet.gender !== 'unknown' && (
              <span className="ml-1">
                {pet.gender === 'male' ? '♂' : '♀'}
              </span>
            )}
          </p>
        </div>

        {/* Info grid */}
        <div className="space-y-3 border-t pt-4">
          <DetailRow
            label="类型"
            value={
              pet.species === 'dog'
                ? '🐕 狗狗'
                : pet.species === 'cat'
                ? '🐈 猫咪'
                : '🐾 其他'
            }
          />
          <DetailRow label="品种" value={pet.breed || '-'} />
          <DetailRow
            label="性别"
            value={
              pet.gender === 'male'
                ? '♂ 公'
                : pet.gender === 'female'
                ? '♀ 母'
                : '未知'
            }
          />
          <DetailRow label="生日" value={pet.birthday || '-'} />
          <DetailRow
            label="体重"
            value={pet.weight ? `${pet.weight} kg` : '-'}
          />
          <DetailRow label="绝育" value={pet.is_neutered ? '是' : '否'} />
          <DetailRow label="芯片号" value={pet.chip_number || '-'} />
          {pet.notes && <DetailRow label="备注" value={pet.notes} />}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Link
            to={`/pets/${pet.id}/edit`}
            className="flex-1 text-center py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            编辑信息
          </Link>
          <button
            className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? '删除中...' : '删除宠物'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

export default PetDetailPage
