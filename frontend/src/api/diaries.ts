import api from './client'
import { getUserInfo } from './auth'

export interface DiaryCreate {
  content: string
  emotion?: string
  music?: any
  date?: string
}

export interface DiaryResponse {
  id: number
  user_id: number
  date: string
  content: string
  emotion?: string
  music?: any
}

// user types and APIs are handled in api/auth

export async function createDiary(diary: DiaryCreate, userId: number): Promise<DiaryResponse> {
  try {
    const { data } = await api.post<DiaryResponse>(`/diaries?user_id=${userId}`, diary)
    return data
  } catch (err: any) {
    // If 404 (user not found), refresh user_id from username and retry once
    if (err?.response?.status === 404) {
      const username = localStorage.getItem('username')
      if (username) {
        try {
          const user = await getUserInfo(username)
          localStorage.setItem('user_id', String(user.id))
          const { data } = await api.post<DiaryResponse>(`/diaries?user_id=${user.id}`, diary)
          return data
        } catch {}
      }
    }
    throw err
  }
}

export async function getDiaries(userId: number, limit: number = 30): Promise<DiaryResponse[]> {
  try {
    const { data } = await api.get<DiaryResponse[]>(`/diaries?user_id=${userId}&limit=${limit}`)
    return data
  } catch (err: any) {
    if (err?.response?.status === 404) {
      const username = localStorage.getItem('username')
      if (username) {
        try {
          const user = await getUserInfo(username)
          localStorage.setItem('user_id', String(user.id))
          const { data } = await api.get<DiaryResponse[]>(`/diaries?user_id=${user.id}&limit=${limit}`)
          return data
        } catch {}
      }
    }
    throw err
  }
}

export async function getDiary(diaryId: number): Promise<DiaryResponse> {
  const { data } = await api.get<DiaryResponse>(`/diaries/${diaryId}`)
  return data
}
