import { create } from 'zustand'
import {
  type LoginData,
  type RegisterData,
  type UserInfo,
  getMe,
  loginUser,
  registerUser,
  refreshToken as refreshTokenApi,
} from '../api/auth'

interface AuthState {
  user: UserInfo | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refresh: () => Promise<string | null>
  fetchUser: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (data: LoginData) => {
    set({ isLoading: true })
    try {
      const response = await loginUser(data)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      set({
        token: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
      })
      // Fetch user info after login
      await get().fetchUser()
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true })
    try {
      await registerUser(data)
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },

  refresh: async () => {
    const currentRefreshToken = get().refreshToken
    if (!currentRefreshToken) {
      get().logout()
      return null
    }
    try {
      const response = await refreshTokenApi(currentRefreshToken)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      set({
        token: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
      })
      return response.access_token
    } catch {
      get().logout()
      return null
    }
  },

  fetchUser: async () => {
    try {
      const user = await getMe()
      set({ user })
    } catch {
      // If fetching user fails, token might be invalid
    }
  },

  initialize: async () => {
    const token = get().token
    if (token) {
      set({ isLoading: true })
      try {
        await get().fetchUser()
      } catch {
        // Try refreshing token
        const newToken = await get().refresh()
        if (newToken) {
          await get().fetchUser()
        }
      } finally {
        set({ isLoading: false })
      }
    }
  },
}))
