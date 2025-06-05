'use client'

import { useState } from 'react'
import { Trophy, Clock, Film, TrendingUp } from 'lucide-react'

interface Challenge {
  id: string
  name: string
  description: string
  progress: number
  icon: any
  reward: string
}

const challenges: Challenge[] = [
  {
    id: 'weekly',
    name: 'Weekly Watcher',
    description: 'Watch 5 different shows this week',
    progress: 60,
    icon: Clock,
    reward: '500 points'
  },
  {
    id: 'genre',
    name: 'Genre Explorer',
    description: 'Try content from 3 new genres',
    progress: 33,
    icon: Film,
    reward: '300 points'
  },
  {
    id: 'streak',
    name: 'Binge Streak',
    description: 'Watch something 5 days in a row',
    progress: 80,
    icon: TrendingUp,
    reward: '1000 points'
  }
]

export function BingerChallenge() {
  const [activeChallenges] = useState<Challenge[]>(challenges)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-yellow-500/20">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Binger's Challenge</h2>
          <p className="text-sm text-gray-400">Complete challenges to earn rewards</p>
        </div>
      </div>

      <div className="grid gap-4">
        {activeChallenges.map((challenge) => {
          const Icon = challenge.icon
          return (
            <div
              key={challenge.id}
              className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-500/20">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{challenge.name}</h3>
                    <span className="text-sm text-yellow-500">{challenge.reward}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{challenge.description}</p>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-primary-500 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400">{challenge.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 