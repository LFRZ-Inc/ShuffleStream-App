'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

interface Platform {
  id: string
  name: string
  icon: string
  color: string
  popular?: boolean
}

interface Genre {
  id: string
  name: string
  icon: string
}

interface CulturalPreference {
  id: string
  name: string
  description: string
  icon: string
  defaultEnabled: boolean
}

const platforms: Platform[] = [
  { id: 'netflix', name: 'Netflix', icon: '🎬', color: 'bg-red-500', popular: true },
  { id: 'disney', name: 'Disney+', icon: '🏰', color: 'bg-blue-600', popular: true },
  { id: 'hulu', name: 'Hulu', icon: '📺', color: 'bg-green-500', popular: true },
  { id: 'prime', name: 'Prime Video', icon: '📦', color: 'bg-blue-400', popular: true },
  { id: 'hbo', name: 'HBO Max', icon: '👑', color: 'bg-purple-600' },
  { id: 'apple', name: 'Apple TV+', icon: '🍎', color: 'bg-gray-800' },
  { id: 'paramount', name: 'Paramount+', icon: '⭐', color: 'bg-blue-700' },
  { id: 'peacock', name: 'Peacock', icon: '🦚', color: 'bg-purple-500' },
  { id: 'spotify', name: 'Spotify', icon: '🎵', color: 'bg-green-600' },
  { id: 'youtube-music', name: 'YouTube Music', icon: '🎶', color: 'bg-red-600' }
]

const genres: Genre[] = [
  { id: 'action', name: 'Action', icon: '💥' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'drama', name: 'Drama', icon: '🎭' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' },
  { id: 'romance', name: 'Romance', icon: '💕' },
  { id: 'thriller', name: 'Thriller', icon: '🔪' },
  { id: 'documentary', name: 'Documentary', icon: '📚' },
  { id: 'animation', name: 'Animation', icon: '🎨' },
  { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
  { id: 'crime', name: 'Crime', icon: '🕵️' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' }
]

const culturalPreferences: CulturalPreference[] = [
  {
    id: 'pride',
    name: 'Pride Content',
    description: 'LGBTQ+ themed content and Pride month celebrations',
    icon: '🏳️‍🌈',
    defaultEnabled: false
  },
  {
    id: 'religious',
    name: 'Religious Content',
    description: 'Faith-based content and religious holiday themes',
    icon: '🕊️',
    defaultEnabled: false
  },
  {
    id: 'political',
    name: 'Political Content',
    description: 'Political documentaries and current affairs',
    icon: '🗳️',
    defaultEnabled: false
  },
  {
    id: 'social-justice',
    name: 'Social Justice',
    description: 'Content focused on social issues and activism',
    icon: '✊',
    defaultEnabled: false
  },
  {
    id: 'thematic-ui',
    name: 'Themed UI',
    description: 'Special UI themes for holidays and events',
    icon: '🎨',
    defaultEnabled: false
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [culturalSettings, setCulturalSettings] = useState<Record<string, boolean>>({})

  const totalSteps = 3

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    )
  }

  const toggleCulturalSetting = (settingId: string) => {
    setCulturalSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    // Save user preferences to database
    const preferences = {
      platforms: selectedPlatforms,
      genres: selectedGenres,
      cultural: culturalSettings
    }
    
    console.log('Saving preferences:', preferences)
    
    // In a real app, this would save to Supabase
    // await saveUserPreferences(preferences)
    
    router.push('/dashboard')
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedPlatforms.length > 0
      case 2: return selectedGenres.length > 0
      case 3: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full p-3">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to ShuffleStream</h1>
          <p className="text-gray-400">Let's personalize your experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Which platforms do you use?</h2>
              <p className="text-gray-400 mb-6">Select all the streaming services you have access to</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {platforms.map((platform) => (
                  <motion.button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {platform.popular && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                        Popular
                      </div>
                    )}
                    <div className="text-3xl mb-2">{platform.icon}</div>
                    <div className="font-medium">{platform.name}</div>
                    {selectedPlatforms.includes(platform.id) && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-primary-500" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">What do you like to watch?</h2>
              <p className="text-gray-400 mb-6">Choose your favorite genres (select at least 3)</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {genres.map((genre) => (
                  <motion.button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedGenres.includes(genre.id)
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-2">{genre.icon}</div>
                    <div className="font-medium">{genre.name}</div>
                    {selectedGenres.includes(genre.id) && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-primary-500" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Cultural Content Preferences</h2>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-green-500" />
                <p className="text-gray-400">All settings are opt-in and can be changed anytime</p>
              </div>
              
              <div className="space-y-4">
                {culturalPreferences.map((pref) => (
                  <motion.div
                    key={pref.id}
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.7)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{pref.icon}</div>
                        <div>
                          <h3 className="font-medium">{pref.name}</h3>
                          <p className="text-sm text-gray-400">{pref.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCulturalSetting(pref.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          culturalSettings[pref.id]
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {culturalSettings[pref.id] ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              step === 1
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              canProceed()
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === totalSteps ? 'Complete Setup' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 