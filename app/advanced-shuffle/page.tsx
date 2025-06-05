'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Shuffle,
  Filter,
  Calendar,
  Star,
  Clock,
  Users,
  Play,
  Loader2,
  Settings,
  Target,
  Zap
} from 'lucide-react'

interface FilterState {
  platforms: string[]
  genres: string[]
  contentType: 'all' | 'movie' | 'tv'
  minRating: number
  maxRating: number
  yearRange: [number, number]
  duration: 'any' | 'short' | 'medium' | 'long'
  mood: string
  watchedStatus: 'all' | 'unwatched' | 'rewatchable'
}

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

export default function AdvancedShufflePage() {
  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    genres: [],
    contentType: 'all',
    minRating: 0,
    maxRating: 10,
    yearRange: [1990, 2024],
    duration: 'any',
    mood: '',
    watchedStatus: 'all'
  })
  
  const [isShuffling, setIsShuffling] = useState(false)
  const [result, setResult] = useState<ContentItem | null>(null)
  const [alternatives, setAlternatives] = useState<ContentItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const platforms = [
    { id: 'netflix', name: 'Netflix', color: 'bg-red-600' },
    { id: 'disney', name: 'Disney+', color: 'bg-blue-600' },
    { id: 'hulu', name: 'Hulu', color: 'bg-green-600' },
    { id: 'prime', name: 'Prime Video', color: 'bg-blue-500' },
    { id: 'hbo', name: 'HBO Max', color: 'bg-purple-600' },
    { id: 'apple', name: 'Apple TV+', color: 'bg-gray-800' },
    { id: 'paramount', name: 'Paramount+', color: 'bg-blue-700' },
    { id: 'peacock', name: 'Peacock', color: 'bg-purple-500' }
  ]

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
    'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
  ]

  const moods = [
    { id: 'feel-good', name: 'Feel Good', emoji: '😊' },
    { id: 'thrilling', name: 'Thrilling', emoji: '😱' },
    { id: 'romantic', name: 'Romantic', emoji: '💕' },
    { id: 'funny', name: 'Funny', emoji: '😂' },
    { id: 'mind-bending', name: 'Mind-bending', emoji: '🤯' },
    { id: 'nostalgic', name: 'Nostalgic', emoji: '🥺' },
    { id: 'epic', name: 'Epic', emoji: '⚔️' },
    { id: 'cozy', name: 'Cozy', emoji: '🏠' }
  ]

  const handlePlatformToggle = (platformId: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const handleGenreToggle = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleAdvancedShuffle = async () => {
    setIsShuffling(true)
    setError(null)
    setResult(null)
    setAlternatives([])

    try {
      const response = await fetch('/api/shuffle/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'preference',
          platforms: filters.platforms.length > 0 ? filters.platforms : undefined,
          genres: filters.genres.length > 0 ? filters.genres : undefined,
          contentType: filters.contentType,
          mood: filters.mood,
          minRating: filters.minRating,
          maxRating: filters.maxRating,
          yearRange: filters.yearRange,
          duration: filters.duration,
          watchedStatus: filters.watchedStatus,
          userId: 'demo-user'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data.recommendation)
        setAlternatives(data.data.alternatives)
      } else {
        setError(data.error || 'Failed to generate shuffle')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Advanced shuffle error:', err)
    } finally {
      setIsShuffling(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      platforms: [],
      genres: [],
      contentType: 'all',
      minRating: 0,
      maxRating: 10,
      yearRange: [1990, 2024],
      duration: 'any',
      mood: '',
      watchedStatus: 'all'
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.platforms.length > 0) count++
    if (filters.genres.length > 0) count++
    if (filters.contentType !== 'all') count++
    if (filters.minRating > 0 || filters.maxRating < 10) count++
    if (filters.yearRange[0] > 1990 || filters.yearRange[1] < 2024) count++
    if (filters.duration !== 'any') count++
    if (filters.mood) count++
    if (filters.watchedStatus !== 'all') count++
    return count
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-400" />
          <span className="text-xl font-bold">Advanced Shuffle</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Reset All
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Filters Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platforms */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Platforms ({filters.platforms.length} selected)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      filters.platforms.includes(platform.id)
                        ? `${platform.color} border-white/30`
                        : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Content Type */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-400" />
                Content Type
              </h3>
              <div className="flex gap-3">
                {[
                  { id: 'all', name: 'All Content' },
                  { id: 'movie', name: 'Movies Only' },
                  { id: 'tv', name: 'TV Shows Only' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilters(prev => ({ ...prev, contentType: type.id as any }))}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filters.contentType === type.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Genres */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-400" />
                Genres ({filters.genres.length} selected)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.genres.includes(genre)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </section>

            {/* Rating Range */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Rating Range
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Minimum Rating: {filters.minRating}/10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Maximum Rating: {filters.maxRating}/10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.maxRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRating: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </section>

            {/* Year Range */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Release Year
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    From: {filters.yearRange[0]}
                  </label>
                  <input
                    type="range"
                    min="1990"
                    max="2024"
                    value={filters.yearRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      yearRange: [parseInt(e.target.value), prev.yearRange[1]] 
                    }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    To: {filters.yearRange[1]}
                  </label>
                  <input
                    type="range"
                    min="1990"
                    max="2024"
                    value={filters.yearRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      yearRange: [prev.yearRange[0], parseInt(e.target.value)] 
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            </section>

            {/* Mood */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Mood
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      mood: prev.mood === mood.id ? '' : mood.id 
                    }))}
                    className={`p-3 rounded-lg border transition-all ${
                      filters.mood === mood.id
                        ? 'bg-purple-600 border-purple-400'
                        : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-lg mb-1">{mood.emoji}</div>
                    <div className="text-sm">{mood.name}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Shuffle Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Shuffle Button */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2">Ready to Shuffle?</h3>
                  <p className="text-sm text-gray-400">
                    {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
                  </p>
                </div>
                
                <motion.button
                  onClick={handleAdvancedShuffle}
                  disabled={isShuffling}
                  whileHover={{ scale: isShuffling ? 1 : 1.05 }}
                  whileTap={{ scale: isShuffling ? 1 : 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isShuffling ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Shuffle className="w-5 h-5" />
                  )}
                  {isShuffling ? 'Shuffling...' : 'Start Advanced Shuffle'}
                </motion.button>
              </div>

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Your Match</h3>
                  
                  <div className="space-y-4">
                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
                      {result.poster && result.poster !== "" ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${result.poster}`}
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center p-4"
                          style={{ background: result.themed_background || 'linear-gradient(135deg, #667eea, #764ba2)' }}
                        >
                          <h4 className="text-white font-bold text-center leading-tight">
                            {result.title}
                          </h4>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">{result.title}</h4>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          {result.rating}/10
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {result.year}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {result.duration}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.open(result.deepLink, '_blank')}
                      className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Watch Now
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 