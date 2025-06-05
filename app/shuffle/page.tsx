'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shuffle, 
  Target, 
  List, 
  Volume2, 
  Tv,
  Play,
  Settings,
  Filter,
  Clock,
  Star,
  ExternalLink,
  RefreshCw,
  Heart,
  Share2
} from 'lucide-react'

interface ShuffleMode {
  id: string
  name: string
  description: string
  icon: any
  color: string
  available: boolean
}

interface Content {
  id: string
  title: string
  platform: string
  genre: string[]
  rating: number
  year: number
  duration: number
  image: string
  deepLink: string
  description: string
}

const shuffleModes: ShuffleMode[] = [
  {
    id: 'full',
    name: 'Full Shuffle',
    description: 'Anything, across all selected platforms',
    icon: Shuffle,
    color: 'from-purple-500 to-pink-500',
    available: true
  },
  {
    id: 'preference',
    name: 'Preference Shuffle',
    description: 'Based on your genres & viewing history',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    available: true
  },
  {
    id: 'cable',
    name: 'Cable Mode',
    description: 'Autoplay, endless channel-style experience',
    icon: Tv,
    color: 'from-orange-500 to-red-500',
    available: true
  },
  {
    id: 'list',
    name: 'List Shuffle',
    description: 'Shuffle your curated packs',
    icon: List,
    color: 'from-blue-500 to-cyan-500',
    available: true
  },
  {
    id: 'show',
    name: 'Show Shuffle',
    description: 'Random episode from a show',
    icon: Volume2,
    color: 'from-indigo-500 to-purple-500',
    available: true
  }
]

// Mock data for demonstration
const mockContent: Content = {
  id: '1',
  title: 'Stranger Things',
  platform: 'Netflix',
  genre: ['Sci-Fi', 'Horror', 'Drama'],
  rating: 8.7,
  year: 2016,
  duration: 51,
  image: '/api/placeholder/400/600',
  deepLink: 'https://netflix.com/title/80057281',
  description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.'
}

export default function ShufflePage() {
  const [selectedMode, setSelectedMode] = useState<string>('full')
  const [currentContent, setCurrentContent] = useState<Content | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [shuffleHistory, setShuffleHistory] = useState<Content[]>([])

  // Filters
  const [filters, setFilters] = useState({
    platforms: [] as string[],
    genres: [] as string[],
    minRating: 0,
    maxDuration: 180,
    contentType: 'all' as 'all' | 'movies' | 'series'
  })

  const handleShuffle = async () => {
    setIsShuffling(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, this would call the shuffle API with the selected mode and filters
    setCurrentContent(mockContent)
    
    if (currentContent) {
      setShuffleHistory(prev => [currentContent, ...prev.slice(0, 9)])
    }
    
    setIsShuffling(false)
  }

  const handleWatchNow = () => {
    if (currentContent?.deepLink) {
      window.open(currentContent.deepLink, '_blank')
    }
  }

  const handleAddToList = () => {
    // Add to user's list
    console.log('Adding to list:', currentContent?.title)
  }

  const handleShare = () => {
    if (currentContent) {
      navigator.share?.({
        title: `Check out ${currentContent.title}`,
        text: `I found this on ShuffleStream: ${currentContent.title}`,
        url: window.location.href
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Shuffle & Discover</h1>
          <p className="text-gray-400">Let AI find your next favorite content</p>
        </div>

        {/* Shuffle Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {shuffleModes.map((mode) => {
            const Icon = mode.icon
            return (
              <motion.button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMode === mode.id
                    ? 'border-white bg-gradient-to-br ' + mode.color
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!mode.available}
              >
                <div className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-medium mb-1">{mode.name}</h3>
                  <p className="text-xs text-gray-300">{mode.description}</p>
                </div>
                {selectedMode === mode.id && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-white"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Filters Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Platform Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Platforms</label>
                <div className="space-y-2">
                  {['Netflix', 'Disney+', 'Hulu', 'Prime Video'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 rounded"
                        checked={filters.platforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              platforms: [...prev.platforms, platform]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              platforms: prev.platforms.filter(p => p !== platform)
                            }))
                          }
                        }}
                      />
                      <span className="text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Genres</label>
                <div className="space-y-2">
                  {['Action', 'Comedy', 'Drama', 'Horror'].map(genre => (
                    <label key={genre} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 rounded"
                        checked={filters.genres.includes(genre)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              genres: [...prev.genres, genre]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              genres: prev.genres.filter(g => g !== genre)
                            }))
                          }
                        }}
                      />
                      <span className="text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Rating: {filters.minRating}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minRating: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Duration: {filters.maxDuration}m
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={filters.maxDuration}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    maxDuration: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Shuffle Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shuffle Result */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 min-h-[400px] flex items-center justify-center">
              {isShuffling ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <RefreshCw className="w-16 h-16 mx-auto mb-4 animate-spin text-primary-500" />
                  <h3 className="text-xl font-semibold mb-2">Finding your next watch...</h3>
                  <p className="text-gray-400">Analyzing your preferences</p>
                </motion.div>
              ) : currentContent ? (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={currentContent.image}
                        alt={currentContent.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{currentContent.title}</h2>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-primary-500 px-2 py-1 rounded text-sm">
                          {currentContent.platform}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{currentContent.rating}</span>
                        </div>
                        <span className="text-gray-400">{currentContent.year}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{currentContent.duration}m</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentContent.genre.map(g => (
                          <span key={g} className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                            {g}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-300 mb-6">{currentContent.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleWatchNow}
                          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Watch Now
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleAddToList}
                          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Add to List
                        </button>
                        <button
                          onClick={handleShare}
                          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center">
                  <Shuffle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2">Ready to shuffle?</h3>
                  <p className="text-gray-400 mb-6">Click the button below to discover your next watch</p>
                </div>
              )}
            </div>

            {/* Shuffle Button */}
            <div className="text-center mt-6">
              <motion.button
                onClick={handleShuffle}
                disabled={isShuffling}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isShuffling
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl'
                }`}
                whileHover={!isShuffling ? { scale: 1.05 } : {}}
                whileTap={!isShuffling ? { scale: 0.95 } : {}}
              >
                {isShuffling ? (
                  <>
                    <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                    Shuffling...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-5 h-5 inline mr-2" />
                    Shuffle {shuffleModes.find(m => m.id === selectedMode)?.name}
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Shuffles */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Recent Shuffles</h3>
              {shuffleHistory.length > 0 ? (
                <div className="space-y-3">
                  {shuffleHistory.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                      <div className="w-12 h-16 bg-gray-600 rounded overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.platform}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No recent shuffles yet</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Today's Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shuffles</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Watched</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Saved</span>
                  <span className="font-semibold">45m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 