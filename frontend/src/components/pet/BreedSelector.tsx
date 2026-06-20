import { useState, useEffect, useMemo } from 'react'
import type { Breed } from '../../types/pet'
import { breedApi } from '../../api/pets'

interface BreedSelectorProps {
  species: string
  value: string | null
  onChange: (breed: string | null) => void
}

function BreedSelector({ species, value, onChange }: BreedSelectorProps) {
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (species === 'cat' || species === 'dog') {
      breedApi.list(species).then(setBreeds).catch(() => setBreeds([]))
    } else {
      setBreeds([])
    }
  }, [species])

  const filtered = useMemo(
    () =>
      breeds.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.name_cn.includes(search)
      ),
    [breeds, search]
  )

  const displayValue =
    breeds.find((b) => b.name === value)?.name_cn || value || ''

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        品种
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="搜索品种..."
        value={open ? search : displayValue}
        onChange={(e) => {
          setSearch(e.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          setOpen(true)
          setSearch('')
        }}
        onBlur={() => {
          // Delay to allow click on dropdown item
          setTimeout(() => setOpen(false), 200)
        }}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((breed) => (
            <li
              key={breed.id}
              className="px-3 py-2 hover:bg-primary-50 cursor-pointer text-sm"
              onMouseDown={() => {
                onChange(breed.name)
                setSearch('')
                setOpen(false)
              }}
            >
              <span className="font-medium">{breed.name_cn}</span>
              <span className="text-gray-400 ml-2">{breed.name}</span>
            </li>
          ))}
        </ul>
      )}
      {species === 'other' && (
        <input
          type="text"
          className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="请输入品种名称"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )}
    </div>
  )
}

export default BreedSelector
