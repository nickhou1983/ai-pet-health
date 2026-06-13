import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Header />
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
