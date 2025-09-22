import { create } from 'zustand'
import { EmotionPrediction } from '../api/analyze'
import { TrackInfo } from '../api/recommend'
import { DiaryResponse } from '../api/diaries'

interface DiaryState {
  // Current diary editing
  currentText: string
  selectedEmotion: string | null
  predictions: EmotionPrediction[]
  recommendations: TrackInfo[]
  targetFeatures: Record<string, number> | null
  
  // History
  diaries: DiaryResponse[]
  
  // Loading states
  isAnalyzing: boolean
  isRecommending: boolean
  isSaving: boolean
  isLoading: boolean
  
  // Actions
  setText: (text: string) => void
  setSelectedEmotion: (emotion: string | null) => void
  setPredictions: (predictions: EmotionPrediction[]) => void
  setRecommendations: (recommendations: TrackInfo[], target?: Record<string, number>) => void
  setDiaries: (diaries: DiaryResponse[]) => void
  addDiary: (diary: DiaryResponse) => void
  upsertDiary: (diary: DiaryResponse) => void
  setAnalyzing: (loading: boolean) => void
  setRecommending: (loading: boolean) => void
  setSaving: (loading: boolean) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useDiaryStore = create<DiaryState>((set) => ({
  // Initial state
  currentText: '',
  selectedEmotion: null,
  predictions: [],
  recommendations: [],
  targetFeatures: null,
  diaries: [],
  isAnalyzing: false,
  isRecommending: false,
  isSaving: false,
  isLoading: false,
  
  // Actions
  setText: (text) => set({ currentText: text }),
  setSelectedEmotion: (emotion) => set({ selectedEmotion: emotion }),
  setPredictions: (predictions) => set({ predictions }),
  setRecommendations: (recommendations, target) => set({ 
    recommendations, 
    targetFeatures: target || null 
  }),
  setDiaries: (diaries) => set({ diaries }),
  addDiary: (diary) => set((state) => ({ diaries: [diary, ...state.diaries] })),
  upsertDiary: (diary) => set((state) => {
    const idx = state.diaries.findIndex(d => d.date === diary.date)
    if (idx >= 0) {
      const next = state.diaries.slice()
      next[idx] = diary
      return { diaries: next }
    }
    return { diaries: [diary, ...state.diaries] }
  }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setRecommending: (isRecommending) => set({ isRecommending }),
  setSaving: (isSaving) => set({ isSaving }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({
    currentText: '',
    selectedEmotion: null,
    predictions: [],
    recommendations: [],
    targetFeatures: null,
  }),
}))
