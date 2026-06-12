import { Link } from 'react-router-dom'

function Sidebar() {
  const menuItems = [
    { path: '/', label: '首页', icon: '🏠' },
  ]

  return (
    <aside className="w-60 min-h-[calc(100vh-73px)] bg-white border-r border-gray-200 p-4 hidden md:block">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
