import api from './client'

export interface EmotionPrediction {
  label: string
  probability: number
}

export interface AnalyzeRequest {
  text: string
  threshold?: number
  topk?: number
}

export interface AnalyzeResponse {
  predictions: EmotionPrediction[]
  all_probabilities: number[]
}

export async function analyzeEmotion(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  console.log('Sending analyze request:', request)
  try {
    const { data } = await api.post<AnalyzeResponse>('/analyze', request)
    console.log('Analyze response:', data)
    return data
  } catch (error) {
    console.error('Analyze error:', error)
    throw error
  }
}
