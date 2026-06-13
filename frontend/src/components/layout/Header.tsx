import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-950 text-2xl text-white shadow-[0_20px_40px_-22px_rgba(14,165,233,0.7)]">
            🐾
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-brand-500">AI Pet Health</p>
            <p className="font-display text-3xl leading-none text-slate-900">
              宠物健康问诊台
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-brand-700'
                : 'transition hover:text-brand-600'
            }
          >
            首页
          </NavLink>
          <NavLink
            to="/consultations"
            className={({ isActive }) =>
              [
                'inline-flex items-center justify-center rounded-full px-4 py-2 transition',
                isActive
                  ? 'bg-brand-950 text-white'
                  : 'border border-slate-200 bg-white/80 text-slate-600 hover:border-brand-200 hover:text-brand-600',
              ].join(' ')
            }
          >
            AI 问诊
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
