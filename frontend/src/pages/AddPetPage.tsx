import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PetForm from '../components/pet/PetForm'
import { petApi } from '../api/pets'
import { usePetStore } from '../stores/petStore'
import type { PetCreate } from '../types/pet'

function AddPetPage() {
  const navigate = useNavigate()
  const addPet = usePetStore((s) => s.addPet)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: PetCreate) => {
    setLoading(true)
    setError(null)
    try {
      const pet = await petApi.create(data)
      addPet(pet)
      navigate(`/pets/${pet.id}`)
    } catch {
      setError('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">添加宠物</h1>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md p-6">
        <PetForm onSubmit={handleSubmit} loading={loading} submitLabel="添加宠物" />
      </div>
    </div>
  )
}

export default AddPetPage
