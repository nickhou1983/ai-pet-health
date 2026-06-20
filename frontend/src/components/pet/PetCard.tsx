import { Link } from 'react-router-dom'
import type { Pet } from '../../types/pet'

const speciesEmoji: Record<string, string> = {
  dog: '🐕',
  cat: '🐈',
  other: '🐾',
}

interface PetCardProps {
  pet: Pet
}

function PetCard({ pet }: PetCardProps) {
  const age = pet.birthday ? getAge(pet.birthday) : null

  return (
    <Link
      to={`/pets/${pet.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {pet.avatar_url ? (
            <img
              src={pet.avatar_url}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">{speciesEmoji[pet.species] || '🐾'}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {pet.name}
          </h3>
          <p className="text-sm text-gray-500">
            {pet.breed || pet.species}
            {pet.gender !== 'unknown' && (
              <span className="ml-2">
                {pet.gender === 'male' ? '♂' : '♀'}
              </span>
            )}
          </p>
          <div className="flex gap-3 mt-1 text-xs text-gray-400">
            {age && <span>{age}</span>}
            {pet.weight && <span>{pet.weight}kg</span>}
          </div>
        </div>

        {/* Arrow */}
        <svg
          className="w-5 h-5 text-gray-300 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}

function getAge(birthday: string): string {
  const birth = new Date(birthday)
  const now = new Date()
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())
  if (months < 1) return '不到1个月'
  if (months < 12) return `${months}个月`
  const years = Math.floor(months / 12)
  const remaining = months % 12
  return remaining > 0 ? `${years}岁${remaining}个月` : `${years}岁`
}

export default PetCard
