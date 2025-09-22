import api from './client'

export interface EmotionInput {
  label: string
  probability: number
}

export interface TrackInfo {
  id: string
  name: string
  artists: string[] | string  // 백엔드에서 배열로 오지만 문자열로도 처리 가능
  album: string
  preview_url?: string
  external_urls: Record<string, string>
  image_url?: string
  duration_ms?: number
  popularity?: number
  explicit?: boolean
}

export interface RecommendRequest {
  selected: EmotionInput[]
  limit?: number
}

export interface RecommendResponse {
  target: Record<string, number>
  seeds: Record<string, string[]>
  tracks: TrackInfo[]
  total: number
  spotify_params: Record<string, any>
}

export async function getRecommendations(request: RecommendRequest): Promise<RecommendResponse> {
  const { data } = await api.post<RecommendResponse>('/recommend', request)
  return data
}
