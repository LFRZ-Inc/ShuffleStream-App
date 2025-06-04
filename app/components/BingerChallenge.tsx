import { useState, useEffect } from 'react'
import { useBingerChallenge } from '@/hooks/useBingerChallenge'
import { Button } from './ui/button'
import { Trophy, Medal, Star, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface LeaderboardEntry {
  rank: number
  user: {
    display_name: string
  }
  titles_watched_count: number
  points: number
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-2 bg-accent/20 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, progress)}%` }}
        className="absolute inset-y-0 left-0 bg-primary"
      />
    </div>
  )
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        flex items-center justify-between p-3 rounded-lg
        ${isCurrentUser ? 'bg-accent/10' : 'hover:bg-accent/5'}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold w-8">#{entry.rank}</span>
        <span>{entry.user.display_name}</span>
        {entry.rank === 1 && <Crown className="w-4 h-4 text-yellow-500" />}
      </div>
      <div className="flex items-center gap-4">
        <span>{entry.titles_watched_count} titles</span>
        <span className="font-semibold">{entry.points} pts</span>
      </div>
    </motion.div>
  )
}

export function BingerChallenge({ userId }: { userId: string }) {
  const {
    activeChallenges,
    loading,
    error,
    getLeaderboard
  } = useBingerChallenge(userId)

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard()
        setLeaderboard(data)
      } catch (err) {
        console.error('Failed to load leaderboard:', err)
      } finally {
        setLeaderboardLoading(false)
      }
    }

    loadLeaderboard()
  }, [getLeaderboard])

  if (loading) {
    return <div>Loading challenges...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const currentChallenge = activeChallenges[0]

  if (!currentChallenge) {
    return <div>No active challenges</div>
  }

  return (
    <div className="p-4">
      {/* Challenge Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Monthly Binger Challenge
          </h2>
          <div className="flex items-center gap-2">
            <Medal className="w-4 h-4" />
            <span className="text-sm">
              {currentChallenge.challenge.progress} / {currentChallenge.challenge.target}
            </span>
          </div>
        </div>

        <ProgressBar progress={currentChallenge.progress} />

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{currentChallenge.remainingTime} days remaining</span>
          <span>
            {currentChallenge.challenge.reward && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {currentChallenge.challenge.reward}
              </div>
            )}
          </span>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Monthly Leaderboard</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-2">
          {leaderboardLoading ? (
            <div>Loading leaderboard...</div>
          ) : (
            leaderboard.slice(0, 5).map(entry => (
              <LeaderboardRow
                key={entry.rank}
                entry={entry}
                isCurrentUser={entry.user.display_name === userId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
} 