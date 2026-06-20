import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import PetsPage from './pages/PetsPage'
import AddPetPage from './pages/AddPetPage'
import PetDetailPage from './pages/PetDetailPage'
import EditPetPage from './pages/EditPetPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="pets" element={<PetsPage />} />
        <Route path="pets/new" element={<AddPetPage />} />
        <Route path="pets/:id" element={<PetDetailPage />} />
        <Route path="pets/:id/edit" element={<EditPetPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
