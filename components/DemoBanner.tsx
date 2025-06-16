'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const isGitHubPages = typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     window.location.pathname.includes('/ShuffleStream-App'))

  if (!isGitHubPages) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="font-medium">🎬 ShuffleStream Demo</span>
          </div>
          <div className="text-sm opacity-90">
            You're viewing a frontend demo! For full functionality with backend features, 
            <a 
              href="https://github.com/LFRZ-Inc/ShuffleStream-App" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 underline hover:text-blue-200"
            >
              deploy to Vercel
            </a>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 