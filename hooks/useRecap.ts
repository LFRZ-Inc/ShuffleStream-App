'use client'

import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

interface MonthlyRecap {
  month: string
  year: number
  total_watch_time: number
  titles_watched: number
  favorite_genre: string
  favorite_platform: string
  binge_sessions: number
  longest_session: number
  genres_watched: Array<{
    genre: string
    minutes: number
    percentage: number
  }>
  platforms_used: Array<{
    platform: string
    minutes: number
    percentage: number
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlocked_at: string
  }>
  insights: Array<{
    type: string
    message: string
    data?: any
  }>
  comparison: {
    vs_last_month: {
      watch_time_change: number
      titles_change: number
    }
    vs_average_user: {
      watch_time_percentile: number
      titles_percentile: number
    }
  }
}

export function useRecap() {
  const [recap, setRecap] = useState<MonthlyRecap | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const generateRecap = useCallback(async (month: string, year: string): Promise<MonthlyRecap | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/recap/monthly?month=${month}&year=${year}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate recap')
      }

      const data = await response.json()
      setRecap(data.data)
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const getRecap = useCallback(async (month: string, year: string): Promise<MonthlyRecap | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/recap/monthly?month=${month}&year=${year}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get recap')
      }

      const data = await response.json()
      setRecap(data.data)
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const getCurrentMonthRecap = useCallback(async (): Promise<MonthlyRecap | null> => {
    const now = new Date()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const year = now.getFullYear().toString()
    return await getRecap(month, year)
  }, [getRecap])

  const getLastMonthRecap = useCallback(async (): Promise<MonthlyRecap | null> => {
    const now = new Date()
    now.setMonth(now.getMonth() - 1)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const year = now.getFullYear().toString()
    return await getRecap(month, year)
  }, [getRecap])

  return {
    recap,
    loading,
    error,
    generateRecap,
    getRecap,
    getCurrentMonthRecap,
    getLastMonthRecap,
    clearError: () => setError(null)
  }
} 