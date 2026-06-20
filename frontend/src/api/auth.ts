import { apiClient } from './client'

export interface RegisterData {
  email: string
  password: string
  nickname?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UserInfo {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserUpdateData {
  nickname?: string
  avatar_url?: string
}

export async function registerUser(data: RegisterData): Promise<UserInfo> {
  const response = await apiClient.post<UserInfo>('/api/auth/register', data)
  return response.data
}

export async function loginUser(data: LoginData): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/api/auth/login', data)
  return response.data
}

export async function refreshToken(refresh_token: string): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/api/auth/refresh', {
    refresh_token,
  })
  return response.data
}

export async function getMe(): Promise<UserInfo> {
  const response = await apiClient.get<UserInfo>('/api/auth/me')
  return response.data
}

export async function updateMe(data: UserUpdateData): Promise<UserInfo> {
  const response = await apiClient.put<UserInfo>('/api/auth/me', data)
  return response.data
}
