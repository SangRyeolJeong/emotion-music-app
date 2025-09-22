import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useDiaryStore } from '../store/useDiaryStore'
import { getDiaries } from '../api/diaries'
import dayjs from 'dayjs'

export default function History() {
  const {
    diaries,
    isLoading,
    setDiaries,
    setLoading,
  } = useDiaryStore()

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDiaries = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getDiaries(1, 50) // Get last 50 entries
        setDiaries(data)
      } catch (err) {
        setError('일기 데이터를 불러오는 중 오류가 발생했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadDiaries()
  }, [setDiaries, setLoading])

  // Process emotion data for charts
  const emotionFrequency = diaries.reduce((acc, diary) => {
    if (diary.predicted) {
      diary.predicted.forEach(pred => {
        acc[pred.label] = (acc[pred.label] || 0) + 1
      })
    }
    return acc
  }, {} as Record<string, number>)

  const emotionData = Object.entries(emotionFrequency)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 emotions

  // Weekly emotion trends
  const weeklyData = diaries.reduce((acc, diary) => {
    const week = dayjs(diary.date).format('YYYY-MM-DD')
    if (!acc[week]) {
      acc[week] = { week, joy: 0, sadness: 0, anger: 0, fear: 0, total: 0 }
    }
    
    if (diary.predicted) {
      diary.predicted.forEach(pred => {
        if (['joy', 'sadness', 'anger', 'fear'].includes(pred.label)) {
          acc[week][pred.label as keyof typeof acc[typeof week]] += pred.probability
        }
      })
    }
    acc[week].total += 1
    return acc
  }, {} as Record<string, any>)

  const weeklyChartData = Object.values(weeklyData)
    .sort((a, b) => dayjs(a.week).valueOf() - dayjs(b.week).valueOf())
    .slice(-7) // Last 7 days

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        감정 분석 히스토리
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                총 일기 수
              </Typography>
              <Typography variant="h3" color="primary">
                {diaries.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                가장 많은 감정
              </Typography>
              <Typography variant="h5" color="secondary">
                {emotionData[0]?.emotion || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {emotionData[0]?.count || 0}회
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                평균 감정 수
              </Typography>
              <Typography variant="h5">
                {diaries.length > 0 
                  ? (diaries.reduce((sum, d) => sum + (d.predicted?.length || 0), 0) / diaries.length).toFixed(1)
                  : '0'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Emotion Frequency Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              감정 빈도 분석
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Emotion Distribution Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              감정 분포
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionData.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ emotion, percent }) => `${emotion} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {emotionData.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Diaries */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              최근 일기
            </Typography>
            <Grid container spacing={2}>
              {diaries.slice(0, 6).map((diary) => (
                <Grid item xs={12} md={6} key={diary.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {dayjs(diary.date).format('YYYY년 MM월 DD일')}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {diary.text.slice(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {diary.predicted?.slice(0, 3).map((pred) => (
                          <Chip
                            key={pred.label}
                            label={`${pred.label} ${(pred.probability * 100).toFixed(0)}%`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
