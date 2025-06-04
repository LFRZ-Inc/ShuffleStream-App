'use client'

import { useState } from 'react'
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
  Users
} from 'lucide-react'
import { ShuffleControls } from '@/components/ShuffleControls'
import { ContentDisplay } from '@/components/ContentDisplay'
import { PlatformStatus } from '@/components/PlatformStatus'
import { BingerChallenge } from '@/components/BingerChallenge'
import { CulturalThemes } from '@/components/CulturalThemes'

export default function DashboardPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showCulturalSettings, setShowCulturalSettings] = useState(false)

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

  const connectedPlatforms = [
    { name: 'Netflix', connected: true, color: 'bg-red-600' },
    { name: 'Disney+', connected: true, color: 'bg-blue-600' },
    { name: 'Prime Video', connected: true, color: 'bg-blue-500' },
    { name: 'Hulu', connected: false, color: 'bg-green-500' }
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

  const handleStartShuffle = (mode: string) => {
    setSelectedMode(mode)
    // This would deep link to the user's streaming apps
    console.log(`Launching ${mode} shuffle - will deep link to streaming platforms`)
  }

  const toggleCulturalTheme = (themeId: string) => {
    console.log(`Toggling cultural theme: ${themeId}`)
  }

  // In a real app, this would come from auth
  const userId = 'demo-user'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold">ShuffleStream</h1>
          <p className="text-xs text-gray-400">Smart Streaming Assistant</p>
        </div>
        <div className="flex items-center gap-3">
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(challengeStats.weeklyProgress / challengeStats.weeklyGoal) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content Display */}
            <section className="bg-card rounded-lg shadow-lg overflow-hidden">
              <ContentDisplay />
            </section>

            {/* Shuffle Controls */}
            <section className="bg-card rounded-lg shadow-lg overflow-hidden">
              <ShuffleControls />
            </section>

            {/* Platform Status */}
            <section className="bg-card rounded-lg shadow-lg overflow-hidden">
              <PlatformStatus />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Binger's Challenge */}
            <section className="bg-card rounded-lg shadow-lg overflow-hidden">
              <BingerChallenge userId={userId} />
            </section>

            {/* Cultural Themes */}
            <section className="bg-card rounded-lg shadow-lg overflow-hidden">
              <CulturalThemes userId={userId} />
            </section>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around items-center py-3">
          <button className="flex flex-col items-center gap-1 text-white">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Search className="w-5 h-5" />
            <span className="text-xs">Browse</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Tv className="w-5 h-5" />
            <span className="text-xs">Cable Mode</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Heart className="w-5 h-5" />
            <span className="text-xs">My List</span>
          </button>
        </div>
      </nav>
    </div>
  )
} 