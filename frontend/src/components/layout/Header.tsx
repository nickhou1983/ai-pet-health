import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold text-primary-700">AI Pet Health</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
            首页
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                {user?.nickname || user?.email || '用户'}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
