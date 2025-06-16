'use client'

import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

interface ShuffleRequest {
  type: 'mood' | 'social' | 'quick' | 'blind' | 'perfect'
  platforms?: string[]
  genres?: string[]
  duration?: string
  rating?: string
  mood?: string
  exclude_watched?: boolean
}

interface ShuffleResult {
  title: {
    id: string
    title: string
    description: string
    genre: string[]
    rating: string
    duration: number
    release_year: number
    poster_url: string
    trailer_url?: string
    tmdb_id: number
    type: 'movie' | 'tv_show'
  }
  platform: {
    id: string
    name: string
    color: string
    icon: string
    deep_link_url?: string
  }
  cultural_content?: string[]
}

interface ShuffleListRequest {
  list_name: string
  platforms?: string[]
  genres?: string[]
  title_count: number
}

interface ShuffleListResult {
  list_id: string
  list_name: string
  total_titles: number
  remaining_titles: number
  titles: Array<{
    id: string
    title: string
    description: string
    genre: string[]
    rating: string
    duration: number
    release_year: number
    poster_url: string
    platform_name: string
    platform_color: string
    deep_link_url?: string
  }>
}

export function useShuffleAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const shuffleFull = useCallback(async (request: ShuffleRequest): Promise<ShuffleResult | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/shuffle/full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to shuffle')
      }

      const data = await response.json()
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const createShuffleList = useCallback(async (request: ShuffleListRequest): Promise<ShuffleListResult | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/shuffle/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create shuffle list')
      }

      const data = await response.json()
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const getShuffleList = useCallback(async (listId: string): Promise<ShuffleListResult | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/shuffle/list?list_id=${listId}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get shuffle list')
      }

      const data = await response.json()
      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const markWatched = useCallback(async (titleId: string, watchTime?: number): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated')
      return false
    }

    try {
      const response = await fetch('/api/watch/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          title_id: titleId,
          watch_time_minutes: watchTime || 0,
          completed: true
        })
      })

      return response.ok
    } catch (err) {
      console.error('Failed to mark as watched:', err)
      return false
    }
  }, [user])

  return {
    shuffleFull,
    createShuffleList,
    getShuffleList,
    markWatched,
    loading,
    error,
    clearError: () => setError(null)
  }
} 