import { api } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface UserResponse {
  id: number
  username: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: UserResponse
}

export interface PasswordChangeRequest {
  username: string
  current_password: string
  new_password: string
}

export async function login(loginData: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', loginData)
  return data
}

export async function register(userData: RegisterRequest): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>('/auth/register', userData)
  return data
}

export async function getUserInfo(username: string): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>(`/auth/users/${username}`)
  return data
}

export async function changePassword(passwordData: PasswordChangeRequest): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/change-password', passwordData)
  return data
}
