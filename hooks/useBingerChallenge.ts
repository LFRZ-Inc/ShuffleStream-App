import { useState, useEffect } from 'react'
import { Challenge, Content, ViewingHistory } from '@/types'
import { supabase } from '@/lib/supabase'

interface ChallengeProgress {
  challenge: Challenge;
  progress: number;
  remainingTime: number; // in days
  rank: number;
  totalParticipants: number;
}

export function useBingerChallenge(userId: string) {
  const [activeChallenges, setActiveChallenges] = useState<ChallengeProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Load active challenges and progress
  useEffect(() => {
    async function loadChallenges() {
      try {
        // Get current month's leaderboard entry
        const month = new Date().toISOString().slice(0, 7) // YYYY-MM format
        const { data: leaderboard, error: leaderboardError } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('user_id', userId)
          .eq('month', month)
          .single()
          
        if (leaderboardError) throw leaderboardError
        
        // Get watched titles for the month
        const startOfMonth = new Date(month + '-01')
        const { data: watched, error: watchedError } = await supabase
          .from('watched_titles')
          .select('*')
          .eq('user_id', userId)
          .gte('watched_at', startOfMonth.toISOString())
          
        if (watchedError) throw watchedError
        
        // Calculate challenges
        const challenges: ChallengeProgress[] = [
          {
            challenge: {
              id: 'monthly-binger',
              title: 'Monthly Binger',
              description: 'Watch 30 titles in a month',
              target: 30,
              progress: watched?.length || 0,
              startDate: startOfMonth,
              endDate: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0),
              reward: 'Exclusive Badge'
            },
            progress: ((watched?.length || 0) / 30) * 100,
            remainingTime: Math.ceil((new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            rank: leaderboard?.rank || 0,
            totalParticipants: 0 // Will be updated below
          }
        ]
        
        // Get total participants
        const { count } = await supabase
          .from('leaderboard')
          .select('*', { count: 'exact' })
          .eq('month', month)
        
        if (count) {
          challenges[0].totalParticipants = count
        }
        
        setActiveChallenges(challenges)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load challenges'))
      } finally {
        setLoading(false)
      }
    }
    
    loadChallenges()
  }, [userId])
  
  // Record watched content
  const recordWatch = async (content: Content) => {
    try {
      const watchedAt = new Date().toISOString()
      
      // Record in watched_titles
      const { error: watchError } = await supabase
        .from('watched_titles')
        .insert({
          user_id: userId,
          title_id: content.id,
          watched_at: watchedAt,
          completed: true
        })
        
      if (watchError) throw watchError
      
      // Update leaderboard
      const month = watchedAt.slice(0, 7)
      const { data: leaderboard, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .eq('month', month)
        .single()
        
      if (leaderboardError && leaderboardError.code !== 'PGRST116') { // Not found error
        throw leaderboardError
      }
      
      if (leaderboard) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('leaderboard')
          .update({
            titles_watched_count: leaderboard.titles_watched_count + 1,
            points: leaderboard.points + 10
          })
          .eq('id', leaderboard.id)
          
        if (updateError) throw updateError
      } else {
        // Create new entry
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert({
            user_id: userId,
            month,
            titles_watched_count: 1,
            points: 10,
            rank: 0 // Will be updated by database trigger
          })
          
        if (insertError) throw insertError
      }
      
      // Refresh challenges
      const { data: watched } = await supabase
        .from('watched_titles')
        .select('*')
        .eq('user_id', userId)
        .gte('watched_at', new Date(month + '-01').toISOString())
        
      setActiveChallenges(prev => 
        prev.map(c => ({
          ...c,
          challenge: {
            ...c.challenge,
            progress: watched?.length || 0
          },
          progress: ((watched?.length || 0) / c.challenge.target) * 100
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to record watch'))
      throw err
    }
  }
  
  // Get leaderboard
  const getLeaderboard = async (month?: string) => {
    try {
      const targetMonth = month || new Date().toISOString().slice(0, 7)
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          users (
            display_name
          )
        `)
        .eq('month', targetMonth)
        .order('rank', { ascending: true })
        .limit(100)
        
      if (error) throw error
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get leaderboard'))
      throw err
    }
  }
  
  return {
    activeChallenges,
    loading,
    error,
    recordWatch,
    getLeaderboard
  }
} 