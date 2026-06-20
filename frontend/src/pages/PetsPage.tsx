import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePetStore } from '../stores/petStore'
import PetCard from '../components/pet/PetCard'

function PetsPage() {
  const { pets, loading, error, fetchPets } = usePetStore()

  useEffect(() => {
    fetchPets()
  }, [fetchPets])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="text-primary-500 hover:underline"
          onClick={fetchPets}
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🐾 我的宠物</h1>
        <Link
          to="/pets/new"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          + 添加宠物
        </Link>
      </div>

      {pets.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            还没有添加宠物
          </h2>
          <p className="text-gray-500 mb-6">
            添加你的第一只宠物，开始记录它的健康档案
          </p>
          <Link
            to="/pets/new"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            🐕 添加第一只宠物
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PetsPage
