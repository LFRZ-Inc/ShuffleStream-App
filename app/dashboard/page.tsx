'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
  Loader2,
  Plus,
  Star,
  Clock,
  TrendingUp,
  Award
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
  themed_background?: string
}

interface ShuffleResponse {
  success: boolean
  data?: {
    recommendation: ContentItem
    alternatives: ContentItem[]
    shuffleId: string
    mode: string
  }
  error?: string
}

interface User {
  id: string
  email: string
  name: string
  preferences: {
    platforms: string[]
    genres: string[]
    culturalContent: {
      pride: boolean
      religious: boolean
      political: boolean
      socialJustice: boolean
    }
  }
  isAdmin?: boolean
}

const PLATFORM_COLORS = {
  netflix: 'bg-red-600',
  disney: 'bg-blue-600',
  hulu: 'bg-green-600',
  prime: 'bg-blue-500',
  hbo: 'bg-purple-600',
  apple: 'bg-gray-800',
  paramount: 'bg-blue-700',
  peacock: 'bg-purple-500'
}

const PLATFORM_NAMES = {
  netflix: 'Netflix',
  disney: 'Disney+',
  hulu: 'Hulu',
  prime: 'Prime Video',
  hbo: 'HBO Max',
  apple: 'Apple TV+',
  paramount: 'Paramount+',
  peacock: 'Peacock'
}

// Content Card Component with themed backgrounds
const ContentCard = ({ content, onClick, showPlatform = true }: { 
  content: ContentItem, 
  onClick?: () => void,
  showPlatform?: boolean 
}) => {
  const [imageError, setImageError] = useState(false)
  
  const handleImageError = () => {
    setImageError(true)
  }

  const shouldShowThemedBackground = !content.poster || imageError || content.poster === ""

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Content Image or Themed Background */}
      <div className="aspect-[2/3] relative">
        {shouldShowThemedBackground ? (
          // Themed Background with Title
          <div 
            className="w-full h-full flex items-center justify-center p-4"
            style={{ background: content.themed_background || 'linear-gradient(135deg, #667eea, #764ba2)' }}
          >
            <div className="text-center">
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                {content.title}
              </h3>
              <div className="flex items-center justify-center space-x-2 text-white/80 text-sm">
                <span>{content.year}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {content.rating}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Poster Image
          <img
            src={`https://image.tmdb.org/t/p/w500${content.poster}`}
            alt={content.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>
        
        {/* Platform badge */}
        {showPlatform && (
          <div className={`absolute top-2 right-2 ${PLATFORM_COLORS[content.platform as keyof typeof PLATFORM_COLORS]} text-white text-xs px-2 py-1 rounded`}>
            {PLATFORM_NAMES[content.platform as keyof typeof PLATFORM_NAMES]}
          </div>
        )}
      </div>
      
      {/* Content Info (only show if we have poster image) */}
      {!shouldShowThemedBackground && (
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {content.title}
          </h3>
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{content.year}</span>
            <div className="flex items-center">
              <Star className="w-3 h-3 mr-1" />
              {content.rating}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function DashboardPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showCulturalSettings, setShowCulturalSettings] = useState(false)
  const [currentRecommendation, setCurrentRecommendation] = useState<ContentItem | null>(null)
  const [alternatives, setAlternatives] = useState<ContentItem[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [recentContent, setRecentContent] = useState<ContentItem[]>([])
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([])

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

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load initial content
    loadTrendingContent()
  }, [])

  const loadTrendingContent = async () => {
    try {
      const response = await fetch('/api/content/discover?type=all&sort_by=popularity.desc')
      const data = await response.json()
      
      if (data.success) {
        const allContent = [...(data.data.movies || []), ...(data.data.tvShows || [])]
        setTrendingContent(allContent.slice(0, 8))
        setRecentContent(allContent.slice(8, 16))
      }
    } catch (error) {
      console.error('Failed to load content:', error)
    }
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
        setCurrentRecommendation(result.data.recommendation)
        setAlternatives(result.data.alternatives)
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

  const handleWatchNow = (content: ContentItem) => {
    // Try to open the app URL first, then fallback to web
    const link = document.createElement('a')
    link.href = content.watchUrl
    link.click()
    
    // Fallback to web URL after a short delay
    setTimeout(() => {
      window.open(content.deepLink, '_blank')
    }, 1000)
  }

  const handleAddToList = (content: ContentItem) => {
    // Add to user's list (mock implementation)
    console.log('Adding to list:', content.title)
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
            Your Shuffle Pick
          </h2>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <ContentCard 
                  content={currentRecommendation} 
                  showPlatform={true}
                />
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{currentRecommendation.title}</h3>
                  <div className="flex items-center space-x-4 text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {currentRecommendation.year}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentRecommendation.duration}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {currentRecommendation.rating}/10
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentRecommendation.genre.map((genre) => (
                      <span key={genre} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">{currentRecommendation.description}</p>
                </div>
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleWatchNow(currentRecommendation)}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Now</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToList(currentRecommendation)}
                    className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to List</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(currentRecommendation.deepLink, '_blank')}
                    className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Open in App</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
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

      {/* Alternative Recommendations */}
      {alternatives.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">More Great Options</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {alternatives.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onClick={() => setCurrentRecommendation(content)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Content */}
      {trendingContent.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
            Trending Now
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingContent.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onClick={() => setCurrentRecommendation(content)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentContent.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-purple-400" />
            Recently Added
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentContent.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onClick={() => setCurrentRecommendation(content)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="grid md:grid-cols-3 gap-6">
        <motion.a
          href="/shuffle"
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl text-center hover:from-purple-700 hover:to-purple-800 transition-all"
        >
          <Shuffle className="w-12 h-12 mx-auto mb-4 text-purple-200" />
          <h3 className="text-xl font-semibold mb-2">Advanced Shuffle</h3>
          <p className="text-purple-200">Customize your shuffle with advanced filters</p>
        </motion.a>

        <motion.a
          href="/browse"
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-pink-600 to-pink-700 p-6 rounded-xl text-center hover:from-pink-700 hover:to-pink-800 transition-all"
        >
          <Users className="w-12 h-12 mx-auto mb-4 text-pink-200" />
          <h3 className="text-xl font-semibold mb-2">Browse Library</h3>
          <p className="text-pink-200">Explore our complete content library</p>
        </motion.a>

        <motion.a
          href="/my-list"
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-center hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <Award className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h3 className="text-xl font-semibold mb-2">My Lists</h3>
          <p className="text-blue-200">Manage your saved content and shuffle packs</p>
        </motion.a>
      </section>

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