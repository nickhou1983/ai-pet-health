import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PetForm from '../components/pet/PetForm'
import { petApi } from '../api/pets'
import { usePetStore } from '../stores/petStore'
import type { Pet, PetCreate } from '../types/pet'

function EditPetPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updatePetInStore = usePetStore((s) => s.updatePet)
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    petApi
      .get(id)
      .then(setPet)
      .catch(() => navigate('/pets'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleSubmit = async (data: PetCreate) => {
    if (!id) return
    setSaving(true)
    setError(null)
    try {
      const updated = await petApi.update(id, data)
      updatePetInStore(updated)
      navigate(`/pets/${id}`)
    } catch {
      setError('更新失败，请重试')
    } finally {
      setSaving(false)
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
        <Link
          to={`/pets/${id}`}
          className="text-gray-400 hover:text-gray-600"
        >
          ← 返回
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">编辑宠物信息</h1>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md p-6">
        <PetForm
          initialData={{
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            gender: pet.gender,
            birthday: pet.birthday,
            weight: pet.weight,
            is_neutered: pet.is_neutered,
            chip_number: pet.chip_number,
            notes: pet.notes,
          }}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="保存修改"
        />
      </div>
    </div>
  )
}

export default EditPetPage
