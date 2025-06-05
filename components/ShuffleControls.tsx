'use client'

import { useState } from 'react'
import { Shuffle, Target, List, Volume2, Tv } from 'lucide-react'

interface ShuffleMode {
  id: string
  name: string
  description: string
  icon: any
}

const shuffleModes: ShuffleMode[] = [
  {
    id: 'full',
    name: 'Full Shuffle',
    description: 'Anything, across all selected platforms',
    icon: Shuffle,
  },
  {
    id: 'preference',
    name: 'Preference Shuffle',
    description: 'Based on your genres & viewing history',
    icon: Target,
  },
  {
    id: 'cable',
    name: 'Cable Mode',
    description: 'Autoplay, endless channel-style experience',
    icon: Tv,
  },
  {
    id: 'list',
    name: 'List Shuffle',
    description: 'Shuffle your curated packs',
    icon: List,
  },
  {
    id: 'show',
    name: 'Show Shuffle',
    description: 'Random episode from a show',
    icon: Volume2,
  }
]

export function ShuffleControls() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

  const handleStartShuffle = (mode: string) => {
    setSelectedMode(mode)
    // This would deep link to the user's streaming apps
    console.log(`Launching ${mode} shuffle - will deep link to streaming platforms`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shuffleModes.map((mode) => {
        const Icon = mode.icon
        return (
          <button
            key={mode.id}
            onClick={() => handleStartShuffle(mode.id)}
            className={`p-4 rounded-xl transition-all duration-200 ${
              selectedMode === mode.id
                ? 'bg-primary-500/20 border border-primary-500/30'
                : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/20">
                <Icon className="w-5 h-5 text-primary-400" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">{mode.name}</h3>
                <p className="text-sm text-gray-400">{mode.description}</p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
} 