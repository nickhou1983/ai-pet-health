import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

function HomePage() {
  const [status, setStatus] = useState<string>('loading...')

  useEffect(() => {
    apiClient.get('/api/health').then((res) => {
      setStatus(res.data.status)
    }).catch(() => {
      setStatus('disconnected')
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-primary-600 mb-4">
        🐾 AI Pet Health
      </h1>
      <p className="text-gray-600 text-lg mb-6">
        基于 AI 的宠物健康管理平台
      </p>
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-sm text-gray-500">API 状态</p>
        <p className={`text-lg font-semibold ${status === 'healthy' ? 'text-green-600' : 'text-red-500'}`}>
          {status}
        </p>
      </div>
    </div>
  )
}

export default HomePage
