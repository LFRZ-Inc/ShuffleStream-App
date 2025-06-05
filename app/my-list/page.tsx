'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Play, 
  Shuffle, 
  Heart, 
  Star, 
  Clock, 
  Grid, 
  List as ListIcon,
  Search,
  Filter,
  ExternalLink,
  Share2,
  Download,
  Eye,
  EyeOff
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
  addedAt: Date
}

interface ShufflePack {
  id: string
  name: string
  description: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  content: Content[]
  tags: string[]
  color: string
}

// Mock data
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
    addedAt: new Date('2024-01-15')
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
    addedAt: new Date('2024-01-10')
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
    addedAt: new Date('2024-01-08')
  }
]

const mockShufflePacks: ShufflePack[] = [
  {
    id: '1',
    name: 'Sci-Fi Favorites',
    description: 'My collection of the best science fiction content',
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    content: mockContent.filter(c => c.genre.includes('Sci-Fi')),
    tags: ['sci-fi', 'space', 'future'],
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: '2',
    name: 'Weekend Binge',
    description: 'Perfect shows for weekend marathons',
    isPublic: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    content: mockContent.filter(c => c.type === 'series'),
    tags: ['binge', 'series', 'weekend'],
    color: 'from-green-500 to-teal-500'
  },
  {
    id: '3',
    name: 'Movie Night',
    description: 'Great movies for date nights',
    isPublic: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
    content: mockContent.filter(c => c.type === 'movie'),
    tags: ['movies', 'date-night', 'romance'],
    color: 'from-pink-500 to-red-500'
  }
]

export default function MyListPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'packs'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPack, setSelectedPack] = useState<ShufflePack | null>(null)
  const [showCreatePack, setShowCreatePack] = useState(false)
  const [showEditPack, setShowEditPack] = useState(false)
  
  const [myContent, setMyContent] = useState<Content[]>(mockContent)
  const [shufflePacks, setShufflePacks] = useState<ShufflePack[]>(mockShufflePacks)
  
  const [newPack, setNewPack] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: '',
    color: 'from-blue-500 to-purple-500'
  })

  const filteredContent = myContent.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredPacks = shufflePacks.filter(pack =>
    pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pack.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleRemoveFromList = (contentId: string) => {
    setMyContent(prev => prev.filter(item => item.id !== contentId))
  }

  const handleWatchNow = (deepLink: string) => {
    window.open(deepLink, '_blank')
  }

  const handleShufflePack = (pack: ShufflePack) => {
    if (pack.content.length > 0) {
      const randomContent = pack.content[Math.floor(Math.random() * pack.content.length)]
      handleWatchNow(randomContent.deepLink)
    }
  }

  const handleCreatePack = () => {
    if (newPack.name.trim()) {
      const pack: ShufflePack = {
        id: Date.now().toString(),
        name: newPack.name,
        description: newPack.description,
        isPublic: newPack.isPublic,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: [],
        tags: newPack.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        color: newPack.color
      }
      setShufflePacks(prev => [pack, ...prev])
      setNewPack({
        name: '',
        description: '',
        isPublic: false,
        tags: '',
        color: 'from-blue-500 to-purple-500'
      })
      setShowCreatePack(false)
    }
  }

  const handleDeletePack = (packId: string) => {
    setShufflePacks(prev => prev.filter(pack => pack.id !== packId))
  }

  const handleSharePack = (pack: ShufflePack) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out my ${pack.name} shuffle pack`,
        text: pack.description,
        url: `${window.location.origin}/pack/${pack.id}`
      })
    }
  }

  const colorOptions = [
    'from-blue-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-pink-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-blue-500',
    'from-purple-500 to-pink-500'
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Lists</h1>
            <p className="text-gray-400">Manage your saved content and shuffle packs</p>
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

            {/* Create Pack Button */}
            <button
              onClick={() => setShowCreatePack(true)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Pack
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'all' ? 'bg-primary-500' : 'hover:bg-gray-700'
            }`}
          >
            All Content ({myContent.length})
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'packs' ? 'bg-primary-500' : 'hover:bg-gray-700'
            }`}
          >
            Shuffle Packs ({shufflePacks.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={activeTab === 'all' ? 'Search your content...' : 'Search your packs...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Content */}
        {activeTab === 'all' ? (
          // All Content View
          <div>
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">No content in your list</h3>
                <p className="text-gray-400 mb-4">Start adding content from the browse page</p>
                <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors">
                  Browse Content
                </button>
              </div>
            ) : viewMode === 'grid' ? (
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
                            onClick={() => handleRemoveFromList(item.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
                      <p className="text-xs text-gray-400">
                        Added {item.addedAt.toLocaleDateString()}
                      </p>
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
                              onClick={() => handleRemoveFromList(item.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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
                        <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                        <p className="text-xs text-gray-400">
                          Added on {item.addedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Shuffle Packs View
          <div>
            {filteredPacks.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">No shuffle packs yet</h3>
                <p className="text-gray-400 mb-4">Create your first shuffle pack to organize your content</p>
                <button
                  onClick={() => setShowCreatePack(true)}
                  className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Create Your First Pack
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPacks.map((pack) => (
                  <motion.div
                    key={pack.id}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    <div className={`h-32 bg-gradient-to-br ${pack.color} relative`}>
                      <div className="absolute top-4 right-4 flex gap-2">
                        {pack.isPublic ? (
                          <Eye className="w-4 h-4 text-white/80" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-white/80" />
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                        <p className="text-white/80 text-sm">{pack.content.length} items</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-300 text-sm mb-4">{pack.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pack.tags.map(tag => (
                          <span key={tag} className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                          Updated {pack.updatedAt.toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShufflePack(pack)}
                            className="p-2 bg-primary-500 hover:bg-primary-600 rounded transition-colors"
                            disabled={pack.content.length === 0}
                          >
                            <Shuffle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSharePack(pack)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedPack(pack)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePack(pack.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Pack Modal */}
        <AnimatePresence>
          {showCreatePack && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-xl font-semibold mb-4">Create Shuffle Pack</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pack Name</label>
                    <input
                      type="text"
                      value={newPack.name}
                      onChange={(e) => setNewPack(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="Enter pack name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newPack.description}
                      onChange={(e) => setNewPack(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="Describe your pack..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newPack.tags}
                      onChange={(e) => setNewPack(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="action, comedy, weekend..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Color Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewPack(prev => ({ ...prev, color }))}
                          className={`h-12 rounded-lg bg-gradient-to-br ${color} border-2 ${
                            newPack.color === color ? 'border-white' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={newPack.isPublic}
                      onChange={(e) => setNewPack(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="isPublic" className="text-sm">Make this pack public</label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCreatePack(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePack}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                  >
                    Create Pack
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 