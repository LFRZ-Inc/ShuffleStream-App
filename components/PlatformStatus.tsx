'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface Platform {
  id: string
  name: string
  connected: boolean
  color: string
}

const platforms: Platform[] = [
  { id: 'netflix', name: 'Netflix', connected: true, color: 'bg-red-600' },
  { id: 'disney', name: 'Disney+', connected: true, color: 'bg-blue-600' },
  { id: 'hulu', name: 'Hulu', connected: false, color: 'bg-green-500' },
  { id: 'prime', name: 'Prime Video', connected: true, color: 'bg-blue-400' },
  { id: 'hbo', name: 'HBO Max', connected: false, color: 'bg-purple-600' },
  { id: 'apple', name: 'Apple TV+', connected: false, color: 'bg-gray-500' }
]

export function PlatformStatus() {
  const [connectedPlatforms] = useState<Platform[]>(platforms)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {connectedPlatforms.map((platform) => (
        <div
          key={platform.id}
          className={`relative p-4 rounded-xl border transition-all duration-200 ${
            platform.connected
              ? `${platform.color}/20 border-${platform.color}/30`
              : 'bg-gray-800/50 border-gray-700/50'
          }`}
        >
          <div className="absolute top-2 right-2">
            {platform.connected ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-500" />
            )}
          </div>
          
          <div className="text-center">
            <div className={`w-12 h-12 mx-auto rounded-full ${platform.color} flex items-center justify-center mb-2`}>
              <span className="text-xl">{platform.name[0]}</span>
            </div>
            <h3 className="text-sm font-medium truncate">{platform.name}</h3>
            <p className="text-xs text-gray-400">
              {platform.connected ? 'Connected' : 'Not Connected'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 