import { NavLink } from 'react-router-dom'

const menuItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/consultations', label: 'AI 问诊', icon: '🩺' },
  { path: '/pets', label: '宠物档案', icon: '🐾' },
]

function Sidebar() {
  return (
    <aside className="w-full border-b border-white/60 bg-white/45 px-4 py-4 backdrop-blur lg:min-h-[calc(100vh-89px)] lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              [
                'flex min-w-fit items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-300',
                isActive
                  ? 'bg-brand-950 text-white shadow-[0_16px_50px_-28px_rgba(2,132,199,0.95)]'
                  : 'text-slate-600 hover:bg-white/80 hover:text-brand-700',
              ].join(' ')
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
