'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Play, Loader2 } from 'lucide-react'

interface Platform {
  id: string
  name: string
  connected: boolean
  color: string
}

interface PlatformSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  platforms: Platform[]
  onShuffleFromPlatform: (platformId: string) => void
  isShuffling: boolean
}

export const PlatformSelectionModal = ({
  isOpen,
  onClose,
  platforms,
  onShuffleFromPlatform,
  isShuffling
}: PlatformSelectionModalProps) => {
  if (!isOpen) return null

  const connectedPlatforms = platforms.filter(p => p.connected)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Choose Platform</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Select a platform to shuffle content from:
        </p>

        <div className="space-y-3">
          {connectedPlatforms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No platforms connected</p>
              <p className="text-sm text-gray-500">
                Connect platforms in your settings to use platform shuffle
              </p>
            </div>
          ) : (
            connectedPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => onShuffleFromPlatform(platform.id)}
                disabled={isShuffling}
                className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${
                  isShuffling 
                    ? 'opacity-50 cursor-not-allowed bg-gray-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${platform.color}`} />
                <span className="flex-1 text-left font-medium">{platform.name}</span>
                {isShuffling ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))
          )}
        </div>

        {connectedPlatforms.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={() => onShuffleFromPlatform('all')}
              disabled={isShuffling}
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-all ${
                isShuffling
                  ? 'opacity-50 cursor-not-allowed bg-purple-600'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isShuffling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span>Shuffle from All Connected</span>
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
} 