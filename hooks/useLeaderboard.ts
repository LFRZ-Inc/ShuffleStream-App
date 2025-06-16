'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './useAuth'

interface LeaderboardEntry {
  user_id: string
  display_name: string
  avatar_url?: string
  total_watch_time: number
  titles_watched: number
  current_level: string
  current_points: number
  rank: number
  weekly_minutes: number
  daily_streak: number
}

interface LeaderboardResponse {
  monthly_leaders: LeaderboardEntry[]
  user_rank?: LeaderboardEntry
  binger_levels: Array<{
    level: string
    name: string
    min_points: number
    color: string
  }>
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchLeaderboard = useCallback(async (month?: string, year?: string) => {
    if (!user) {
      setError('User not authenticated')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (month) params.append('month', month)
      if (year) params.append('year', year)

      const response = await fetch(`/api/leaderboard?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch leaderboard')
      }

      const data = await response.json()
      setLeaderboard(data.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Auto-fetch current month leaderboard
  useEffect(() => {
    if (user) {
      fetchLeaderboard()
    }
  }, [user, fetchLeaderboard])

  return {
    leaderboard,
    loading,
    error,
    fetchLeaderboard,
    clearError: () => setError(null)
  }
} 