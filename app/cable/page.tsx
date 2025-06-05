'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Settings, 
  Tv, 
  Clock, 
  Star,
  Info,
  Heart,
  Share2,
  Maximize,
  Minimize,
  RotateCcw,
  Zap,
  Radio
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
  videoUrl?: string
}

interface CableChannel {
  id: string
  name: string
  description: string
  genre: string
  color: string
  icon: string
}

// Mock content for cable mode
const mockCableContent: Content[] = [
  {
    id: '1',
    title: 'Stranger Things S1E1',
    platform: 'Netflix',
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    rating: 8.7,
    year: 2016,
    duration: 51,
    image: '/api/placeholder/400/600',
    deepLink: 'https://netflix.com/title/80057281',
    description: 'The Vanishing of Will Byers - A young boy disappears in a small town.',
    type: 'episode',
    videoUrl: '/api/placeholder/video/1'
  },
  {
    id: '2',
    title: 'The Office S2E1',
    platform: 'Peacock',
    genre: ['Comedy'],
    rating: 9.0,
    year: 2005,
    duration: 22,
    image: '/api/placeholder/400/600',
    deepLink: 'https://peacocktv.com/watch/the-office',
    description: 'The Dundies - Michael hosts the annual Dundie Awards.',
    type: 'episode',
    videoUrl: '/api/placeholder/video/2'
  },
  {
    id: '3',
    title: 'Planet Earth: Forests',
    platform: 'BBC',
    genre: ['Documentary', 'Nature'],
    rating: 9.4,
    year: 2006,
    duration: 50,
    image: '/api/placeholder/400/600',
    deepLink: 'https://bbc.com/planet-earth',
    description: 'Explore the world\'s most magnificent forests.',
    type: 'episode',
    videoUrl: '/api/placeholder/video/3'
  },
  {
    id: '4',
    title: 'Friends S5E14',
    platform: 'HBO Max',
    genre: ['Comedy', 'Romance'],
    rating: 8.9,
    year: 1999,
    duration: 22,
    image: '/api/placeholder/400/600',
    deepLink: 'https://hbomax.com/friends',
    description: 'The One Where Everybody Finds Out - Secrets are revealed.',
    type: 'episode',
    videoUrl: '/api/placeholder/video/4'
  }
]

const cableChannels: CableChannel[] = [
  {
    id: 'shuffle-all',
    name: 'Shuffle All',
    description: 'Random content from all genres',
    genre: 'Mixed',
    color: 'from-purple-500 to-pink-500',
    icon: '🎲'
  },
  {
    id: 'comedy-central',
    name: 'Comedy Central',
    description: 'Non-stop laughs and comedy shows',
    genre: 'Comedy',
    color: 'from-yellow-500 to-orange-500',
    icon: '😂'
  },
  {
    id: 'sci-fi-network',
    name: 'Sci-Fi Network',
    description: 'Science fiction and fantasy content',
    genre: 'Sci-Fi',
    color: 'from-blue-500 to-purple-500',
    icon: '🚀'
  },
  {
    id: 'nature-docs',
    name: 'Nature Docs',
    description: 'Beautiful documentaries about our world',
    genre: 'Documentary',
    color: 'from-green-500 to-teal-500',
    icon: '🌍'
  },
  {
    id: 'action-zone',
    name: 'Action Zone',
    description: 'High-octane action and adventure',
    genre: 'Action',
    color: 'from-red-500 to-orange-500',
    icon: '💥'
  },
  {
    id: 'drama-theater',
    name: 'Drama Theater',
    description: 'Compelling dramas and emotional stories',
    genre: 'Drama',
    color: 'from-indigo-500 to-blue-500',
    icon: '🎭'
  }
]

export default function CablePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentChannel, setCurrentChannel] = useState(cableChannels[0])
  const [currentContent, setCurrentContent] = useState<Content>(mockCableContent[0])
  const [showChannelGuide, setShowChannelGuide] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [timeWatched, setTimeWatched] = useState(0)
  const [contentQueue, setContentQueue] = useState<Content[]>([])
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulate content progression
  useEffect(() => {
    if (isPlaying && autoPlay) {
      const timer = setInterval(() => {
        setTimeWatched(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, autoPlay])

  // Auto-advance to next content
  useEffect(() => {
    if (timeWatched >= currentContent.duration * 60) { // Convert minutes to seconds
      handleNextContent()
      setTimeWatched(0)
    }
  }, [timeWatched, currentContent.duration])

  // Generate content queue based on channel
  useEffect(() => {
    const generateQueue = () => {
      let filteredContent = [...mockCableContent]
      
      if (currentChannel.genre !== 'Mixed') {
        filteredContent = mockCableContent.filter(content =>
          content.genre.includes(currentChannel.genre)
        )
      }
      
      // Shuffle and create queue
      const shuffled = filteredContent.sort(() => Math.random() - 0.5)
      setContentQueue(shuffled)
      
      if (shuffled.length > 0) {
        setCurrentContent(shuffled[0])
      }
    }
    
    generateQueue()
  }, [currentChannel])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextContent = () => {
    const currentIndex = contentQueue.findIndex(c => c.id === currentContent.id)
    const nextIndex = (currentIndex + 1) % contentQueue.length
    setCurrentContent(contentQueue[nextIndex])
    setTimeWatched(0)
    setIsPlaying(true)
  }

  const handleChannelChange = (channel: CableChannel) => {
    setCurrentChannel(channel)
    setShowChannelGuide(false)
    setTimeWatched(0)
    setIsPlaying(true)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (timeWatched / (currentContent.duration * 60)) * 100

  return (
    <div 
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-black text-white`}
    >
      <div className="relative h-screen flex flex-col">
        {/* Video Player Area */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
          {/* Placeholder Video */}
          <div className="w-full h-full relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <img
              src={currentContent.image}
              alt={currentContent.title}
              className="max-w-full max-h-full object-contain opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Tv className="w-24 h-24 mx-auto mb-4 text-gray-600" />
                <h3 className="text-2xl font-semibold mb-2">Cable Mode</h3>
                <p className="text-gray-400">Simulated TV experience</p>
              </div>
            </div>
          </div>

          {/* Play/Pause Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Play className="w-20 h-20 text-white" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Channel Info Overlay */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                className="absolute bottom-20 left-6 right-6 bg-black/80 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex gap-4">
                  <img
                    src={currentContent.image}
                    alt={currentContent.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{currentContent.title}</h3>
                    <div className="flex items-center gap-4 mb-2">
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
                    <p className="text-gray-300 text-sm">{currentContent.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-primary-500 transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900/95 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="p-3 bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={handleNextContent}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>

            {/* Center Info */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">{currentChannel.icon}</span>
                <h3 className="font-semibold">{currentChannel.name}</h3>
              </div>
              <p className="text-sm text-gray-400">{currentContent.title}</p>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(timeWatched)} / {formatTime(currentContent.duration * 60)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <Info className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowChannelGuide(!showChannelGuide)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <Radio className="w-5 h-5" />
              </button>

              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`p-2 rounded transition-colors ${
                  autoPlay ? 'bg-primary-500 hover:bg-primary-600' : 'hover:bg-gray-700'
                }`}
              >
                <Zap className="w-5 h-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Channel Guide */}
        <AnimatePresence>
          {showChannelGuide && (
            <motion.div
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Channel Guide</h2>
                  <button
                    onClick={() => setShowChannelGuide(false)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cableChannels.map((channel) => (
                    <motion.button
                      key={channel.id}
                      onClick={() => handleChannelChange(channel)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        currentChannel.id === channel.id
                          ? 'border-white bg-gradient-to-br ' + channel.color
                          : 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{channel.icon}</span>
                        <h3 className="font-semibold">{channel.name}</h3>
                      </div>
                      <p className="text-sm text-gray-300">{channel.description}</p>
                      <div className="mt-2">
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                          {channel.genre}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Cable Mode Features</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Endless autoplay experience</li>
                    <li>• Genre-based channels</li>
                    <li>• No decision fatigue</li>
                    <li>• Discover new content passively</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 