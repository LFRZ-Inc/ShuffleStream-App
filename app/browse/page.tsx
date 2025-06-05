'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  Star, 
  Clock, 
  Play, 
  Heart, 
  Plus,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react'

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
  type: 'movie' | 'series' | 'episode'
  isInMyList?: boolean
}

interface FilterState {
  search: string
  platforms: string[]
  genres: string[]
  contentType: 'all' | 'movies' | 'series'
  minRating: number
  sortBy: 'title' | 'rating' | 'year' | 'popularity'
  sortOrder: 'asc' | 'desc'
}

// Mock data for demonstration
const mockContent: Content[] = [
  {
    id: '1',
    title: 'Stranger Things',
    platform: 'Netflix',
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    rating: 8.7,
    year: 2016,
    duration: 51,
    image: '/api/placeholder/300/450',
    deepLink: 'https://netflix.com/title/80057281',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.',
    type: 'series',
    isInMyList: false
  },
  {
    id: '2',
    title: 'The Mandalorian',
    platform: 'Disney+',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    rating: 8.8,
    year: 2019,
    duration: 40,
    image: '/api/placeholder/300/450',
    deepLink: 'https://disneyplus.com/series/the-mandalorian',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.',
    type: 'series',
    isInMyList: true
  },
  {
    id: '3',
    title: 'Dune',
    platform: 'HBO Max',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 8.0,
    year: 2021,
    duration: 155,
    image: '/api/placeholder/300/450',
    deepLink: 'https://hbomax.com/movie/dune',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset.',
    type: 'movie',
    isInMyList: false
  },
  {
    id: '4',
    title: 'The Office',
    platform: 'Peacock',
    genre: ['Comedy', 'Mockumentary'],
    rating: 9.0,
    year: 2005,
    duration: 22,
    image: '/api/placeholder/300/450',
    deepLink: 'https://peacocktv.com/watch/the-office',
    description: 'A mockumentary on a group of typical office workers.',
    type: 'series',
    isInMyList: true
  },
  {
    id: '5',
    title: 'Spider-Man: No Way Home',
    platform: 'Prime Video',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 8.4,
    year: 2021,
    duration: 148,
    image: '/api/placeholder/300/450',
    deepLink: 'https://primevideo.com/detail/spider-man-no-way-home',
    description: 'Spider-Man seeks help from Doctor Strange when his identity is revealed.',
    type: 'movie',
    isInMyList: false
  },
  {
    id: '6',
    title: 'Ted Lasso',
    platform: 'Apple TV+',
    genre: ['Comedy', 'Drama', 'Sports'],
    rating: 8.8,
    year: 2020,
    duration: 30,
    image: '/api/placeholder/300/450',
    deepLink: 'https://tv.apple.com/show/ted-lasso',
    description: 'An American football coach is hired to coach a British soccer team.',
    type: 'series',
    isInMyList: false
  }
]

const platforms = ['Netflix', 'Disney+', 'HBO Max', 'Prime Video', 'Hulu', 'Apple TV+', 'Peacock', 'Paramount+']
const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation']

export default function BrowsePage() {
  const [content, setContent] = useState<Content[]>(mockContent)
  const [filteredContent, setFilteredContent] = useState<Content[]>(mockContent)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    platforms: [],
    genres: [],
    contentType: 'all',
    minRating: 0,
    sortBy: 'popularity',
    sortOrder: 'desc'
  })

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = [...content]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.genre.some(g => g.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Platform filter
    if (filters.platforms.length > 0) {
      filtered = filtered.filter(item => filters.platforms.includes(item.platform))
    }

    // Genre filter
    if (filters.genres.length > 0) {
      filtered = filtered.filter(item =>
        item.genre.some(g => filters.genres.includes(g))
      )
    }

    // Content type filter
    if (filters.contentType !== 'all') {
      filtered = filtered.filter(item => {
        if (filters.contentType === 'movies') return item.type === 'movie'
        if (filters.contentType === 'series') return item.type === 'series'
        return true
      })
    }

    // Rating filter
    filtered = filtered.filter(item => item.rating >= filters.minRating)

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'year':
          aValue = a.year
          bValue = b.year
          break
        case 'popularity':
          aValue = a.rating * (2024 - a.year + 1) // Simple popularity score
          bValue = b.rating * (2024 - b.year + 1)
          break
        default:
          return 0
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredContent(filtered)
  }, [content, filters])

  const togglePlatform = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleAddToList = (contentId: string) => {
    setContent(prev => prev.map(item =>
      item.id === contentId ? { ...item, isInMyList: !item.isInMyList } : item
    ))
  }

  const handleWatchNow = (deepLink: string) => {
    window.open(deepLink, '_blank')
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      platforms: [],
      genres: [],
      contentType: 'all',
      minRating: 0,
      sortBy: 'popularity',
      sortOrder: 'desc'
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Browse Content</h1>
            <p className="text-gray-400">Discover content across all your platforms</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500' : 'hover:bg-gray-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500' : 'hover:bg-gray-700'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(filters.platforms.length > 0 || filters.genres.length > 0 || filters.search) && (
                <span className="bg-primary-500 text-xs px-2 py-1 rounded-full">
                  {filters.platforms.length + filters.genres.length + (filters.search ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search titles, genres, or descriptions..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-primary-500 hover:text-primary-400 text-sm"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium mb-3">Platforms</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {platforms.map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.platforms.includes(platform)}
                        onChange={() => togglePlatform(platform)}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium mb-3">Genres</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Type & Rating */}
              <div>
                <label className="block text-sm font-medium mb-3">Content Type</label>
                <select
                  value={filters.contentType}
                  onChange={(e) => setFilters(prev => ({ ...prev, contentType: e.target.value as any }))}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4"
                >
                  <option value="all">All Content</option>
                  <option value="movies">Movies Only</option>
                  <option value="series">Series Only</option>
                </select>

                <label className="block text-sm font-medium mb-2">
                  Min Rating: {filters.minRating}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium mb-3">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4"
                >
                  <option value="popularity">Popularity</option>
                  <option value="title">Title</option>
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                    className={`flex-1 p-2 rounded text-sm ${
                      filters.sortOrder === 'asc' ? 'bg-primary-500' : 'bg-gray-700'
                    }`}
                  >
                    Ascending
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                    className={`flex-1 p-2 rounded text-sm ${
                      filters.sortOrder === 'desc' ? 'bg-primary-500' : 'bg-gray-700'
                    }`}
                  >
                    Descending
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Showing {filteredContent.length} of {content.length} titles
          </p>
        </div>

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredContent.map((item) => (
              <motion.div
                key={item.id}
                className="group relative bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                layout
              >
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWatchNow(item.deepLink)}
                        className="p-2 bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAddToList(item.id)}
                        className={`p-2 rounded-full transition-colors ${
                          item.isInMyList
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${item.isInMyList ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary-500 px-2 py-1 rounded">{item.platform}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.genre.slice(0, 2).map(g => (
                      <span key={g} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <motion.div
                key={item.id}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
                layout
              >
                <div className="flex gap-6">
                  <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWatchNow(item.deepLink)}
                          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 px-3 py-1 rounded transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Watch
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAddToList(item.id)}
                          className={`p-2 rounded transition-colors ${
                            item.isInMyList
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${item.isInMyList ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-primary-500 px-2 py-1 rounded text-sm">{item.platform}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{item.rating}</span>
                      </div>
                      <span className="text-gray-400">{item.year}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{item.duration}m</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.genre.map(g => (
                        <span key={g} className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No content found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 