'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shuffle, 
  Target, 
  List,
  Volume2,
  Home,
  Search,
  Tv,
  Heart,
  Crown,
  Sparkles,
  Settings,
  ExternalLink,
  Trophy,
  Zap,
  Eye,
  EyeOff,
  Calendar,
  Flag,
  Users,
  Shield,
  Play,
  Loader2
} from 'lucide-react'
import { ShuffleControls } from '@/components/ShuffleControls'
import { ContentDisplay } from '@/components/ContentDisplay'
import { PlatformStatus } from '@/components/PlatformStatus'
import { BingerChallenge } from '@/components/BingerChallenge'
import { CulturalThemes } from '@/components/CulturalThemes'

interface ContentItem {
  id: number
  title: string
  type: 'movie' | 'tv'
  platform: string
  genre: string[]
  rating: number
  year: number
  duration: string
  description: string
  poster: string
  deepLink: string
  watchUrl: string
}

interface ShuffleResult {
  recommendation: ContentItem
  alternatives: ContentItem[]
  shuffleId: string
  mode: string
}

export default function DashboardPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showCulturalSettings, setShowCulturalSettings] = useState(false)
  const [currentRecommendation, setCurrentRecommendation] = useState<ShuffleResult | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shuffleModes = [
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
      id: 'platform',
      name: 'Platform Shuffle',
      description: 'Random content from specific platforms',
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

  const connectedPlatforms = [
    { name: 'Netflix', connected: true, color: 'bg-red-600', id: 'netflix' },
    { name: 'Disney+', connected: true, color: 'bg-blue-600', id: 'disney' },
    { name: 'Prime Video', connected: true, color: 'bg-blue-500', id: 'prime' },
    { name: 'Hulu', connected: false, color: 'bg-green-500', id: 'hulu' }
  ]

  const culturalThemes = [
    { id: 'pride', name: 'Pride Content', enabled: true, icon: '🏳️‍🌈' },
    { id: 'religious', name: 'Religious Holidays', enabled: false, icon: '🕊️' },
    { id: 'political', name: 'Political Content', enabled: false, icon: '🗳️' },
    { id: 'social', name: 'Social Justice', enabled: true, icon: '✊' }
  ]

  const challengeStats = {
    currentStreak: 7,
    totalWatched: 127,
    rank: 42,
    weeklyGoal: 15,
    weeklyProgress: 8
  }

  const handleStartShuffle = async (mode: string) => {
    setSelectedMode(mode)
    setIsShuffling(true)
    setError(null)

    try {
      const connectedPlatformIds = connectedPlatforms
        .filter(p => p.connected)
        .map(p => p.id)

      const response = await fetch('/api/shuffle/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          platforms: connectedPlatformIds,
          contentType: 'all',
          userId: 'demo-user'
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCurrentRecommendation(result.data)
      } else {
        setError(result.error || 'Failed to generate shuffle')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Shuffle error:', err)
    } finally {
      setIsShuffling(false)
    }
  }

  const handleWatchNow = async (content: ContentItem) => {
    try {
      // Generate deep link
      const response = await fetch('/api/deeplink/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: content.id.toString(),
          platform: content.platform,
          contentType: content.type
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Try app URL first, fallback to web URL
        const link = result.data.appUrl || result.data.webUrl
        window.open(link, '_blank')
      } else {
        // Fallback to platform homepage
        window.open(content.deepLink, '_blank')
      }
    } catch (err) {
      console.error('Deep link error:', err)
      // Fallback to platform homepage
      window.open(content.deepLink, '_blank')
    }
  }

  const toggleCulturalTheme = (themeId: string) => {
    console.log(`Toggling cultural theme: ${themeId}`)
  }

  // In a real app, this would come from auth
  const userId = 'demo-user'

  // In a real app, this would come from auth/user role
  const isAdmin = true // Demo: set to true to show admin access

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold">ShuffleStream</h1>
          <p className="text-xs text-gray-400">Smart Streaming Assistant</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link 
              href="/admin"
              className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-colors group"
              title="Admin Dashboard"
            >
              <Shield className="w-4 h-4 text-red-400 group-hover:text-red-300" />
            </Link>
          )}
          <button 
            onClick={() => setShowCulturalSettings(!showCulturalSettings)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg text-sm font-medium transition-all">
            <Crown className="w-4 h-4 inline mr-2" />
            Unlock Pro
          </button>
        </div>
      </header>

      {/* Cultural Theme Settings Panel */}
      {showCulturalSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-6 mb-4 bg-gray-800 rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Cultural Theme Control
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Choose what themed content you want to see. Everything is opt-in.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {culturalThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => toggleCulturalTheme(theme.id)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  theme.enabled 
                    ? 'bg-green-600/20 border border-green-500/30' 
                    : 'bg-gray-700 border border-gray-600'
                }`}
              >
                <span className="text-lg">{theme.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{theme.name}</p>
                  <p className="text-xs text-gray-400">
                    {theme.enabled ? 'Visible' : 'Hidden'}
                  </p>
                </div>
                {theme.enabled ? (
                  <Eye className="w-4 h-4 text-green-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Challenge Stats */}
      <div className="mx-6 mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Binger's Challenge
          </h3>
          <span className="text-sm text-gray-300">Rank #{challengeStats.rank}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-400">{challengeStats.currentStreak}</p>
            <p className="text-xs text-gray-400">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{challengeStats.totalWatched}</p>
            <p className="text-xs text-gray-400">Total Watched</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{challengeStats.weeklyProgress}/{challengeStats.weeklyGoal}</p>
            <p className="text-xs text-gray-400">Weekly Goal</p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(challengeStats.weeklyProgress / challengeStats.weeklyGoal) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Recommendation */}
      {currentRecommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-6 bg-gray-800 rounded-xl overflow-hidden"
        >
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600">
            {currentRecommendation.recommendation.poster && (
              <img
                src={`https://image.tmdb.org/t/p/w500${currentRecommendation.recommendation.poster}`}
                alt={currentRecommendation.recommendation.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold mb-1">{currentRecommendation.recommendation.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{currentRecommendation.recommendation.description}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleWatchNow(currentRecommendation.recommendation)}
                  className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Watch Now
                </button>
                <button
                  onClick={() => handleStartShuffle(currentRecommendation.mode)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle Again
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-6 bg-red-600/20 border border-red-500/30 rounded-xl p-4"
        >
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Shuffle Modes */}
      <div className="mx-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Choose Your Shuffle</h2>
        <div className="grid grid-cols-1 gap-3">
          {shuffleModes.map((mode) => (
            <motion.button
              key={mode.id}
              onClick={() => handleStartShuffle(mode.id)}
              disabled={isShuffling}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                selectedMode === mode.id
                  ? 'bg-purple-600/30 border border-purple-500/50'
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              } ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: isShuffling ? 1 : 1.02 }}
              whileTap={{ scale: isShuffling ? 1 : 0.98 }}
            >
              <div className={`p-3 rounded-lg ${
                selectedMode === mode.id ? 'bg-purple-600' : 'bg-gray-700'
              }`}>
                {isShuffling && selectedMode === mode.id ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <mode.icon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">{mode.name}</h3>
                <p className="text-sm text-gray-400">{mode.description}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Platform Status */}
      <div className="mx-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">Connected Platforms</h3>
        <div className="grid grid-cols-2 gap-3">
          {connectedPlatforms.map((platform) => (
            <div
              key={platform.name}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                platform.connected ? 'bg-green-600/20 border border-green-500/30' : 'bg-gray-700'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${platform.color}`} />
              <span className="text-sm font-medium">{platform.name}</span>
              <span className="text-xs text-gray-400 ml-auto">
                {platform.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-purple-400">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/browse" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <Search className="w-5 h-5" />
            <span className="text-xs">Browse</span>
          </Link>
          <Link href="/cable" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <Tv className="w-5 h-5" />
            <span className="text-xs">Cable Mode</span>
          </Link>
          <Link href="/my-list" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <Heart className="w-5 h-5" />
            <span className="text-xs">My List</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 