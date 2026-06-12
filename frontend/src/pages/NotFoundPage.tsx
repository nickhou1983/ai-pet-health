import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-600 text-lg mb-6">页面不存在</p>
      <Link to="/" className="text-primary-600 hover:text-primary-700 underline">
        返回首页
      </Link>
    </div>
  )
}

export default NotFoundPage
