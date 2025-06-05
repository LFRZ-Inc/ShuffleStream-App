'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Heart, 
  Eye, 
  Volume2,
  Smartphone,
  Monitor,
  Save,
  RotateCcw,
  ChevronRight,
  Check,
  X,
  Info,
  AlertTriangle,
  Moon,
  Sun,
  Zap,
  Filter,
  Clock,
  Star,
  Users,
  Lock,
  Mail,
  Key,
  Trash2
} from 'lucide-react'

interface UserPreferences {
  // Profile Settings
  username: string
  email: string
  avatar: string
  displayName: string
  bio: string
  
  // Cultural Content Preferences
  culturalContent: {
    prideContent: boolean
    religiousContent: boolean
    politicalContent: boolean
    socialJusticeContent: boolean
    matureContent: boolean
    internationalContent: boolean
  }
  
  // Platform Preferences
  platforms: {
    netflix: boolean
    disney: boolean
    hulu: boolean
    hboMax: boolean
    amazonPrime: boolean
    appleTV: boolean
    peacock: boolean
    paramount: boolean
  }
  
  // Viewing Preferences
  viewing: {
    autoplay: boolean
    skipIntros: boolean
    skipCredits: boolean
    subtitles: boolean
    audioDescription: boolean
    preferredLanguage: string
    preferredQuality: string
    darkMode: boolean
  }
  
  // Notification Settings
  notifications: {
    email: boolean
    push: boolean
    newReleases: boolean
    recommendations: boolean
    friendActivity: boolean
    achievements: boolean
    weeklyRecap: boolean
    marketingEmails: boolean
  }
  
  // Privacy Settings
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    showWatchHistory: boolean
    showFavorites: boolean
    allowFriendRequests: boolean
    shareViewingActivity: boolean
    dataCollection: boolean
  }
  
  // Shuffle Preferences
  shuffle: {
    defaultMode: 'full' | 'preference' | 'show' | 'list' | 'platform'
    excludeWatched: boolean
    favoriteGenres: string[]
    avoidGenres: string[]
    maxRuntime: number
    minRating: number
  }
}

const defaultPreferences: UserPreferences = {
  username: 'streamlover',
  email: 'user@example.com',
  avatar: '/api/placeholder/100/100',
  displayName: 'Stream Lover',
  bio: 'Passionate about discovering great content!',
  
  culturalContent: {
    prideContent: true,
    religiousContent: false,
    politicalContent: false,
    socialJusticeContent: true,
    matureContent: true,
    internationalContent: true
  },
  
  platforms: {
    netflix: true,
    disney: true,
    hulu: false,
    hboMax: true,
    amazonPrime: false,
    appleTV: false,
    peacock: false,
    paramount: false
  },
  
  viewing: {
    autoplay: true,
    skipIntros: true,
    skipCredits: false,
    subtitles: false,
    audioDescription: false,
    preferredLanguage: 'English',
    preferredQuality: 'HD',
    darkMode: true
  },
  
  notifications: {
    email: true,
    push: true,
    newReleases: true,
    recommendations: true,
    friendActivity: false,
    achievements: true,
    weeklyRecap: true,
    marketingEmails: false
  },
  
  privacy: {
    profileVisibility: 'friends',
    showWatchHistory: true,
    showFavorites: true,
    allowFriendRequests: true,
    shareViewingActivity: false,
    dataCollection: true
  },
  
  shuffle: {
    defaultMode: 'preference',
    excludeWatched: true,
    favoriteGenres: ['Sci-Fi', 'Drama', 'Comedy'],
    avoidGenres: ['Horror'],
    maxRuntime: 180,
    minRating: 6.0
  }
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [activeSection, setActiveSection] = useState<'profile' | 'cultural' | 'platforms' | 'viewing' | 'notifications' | 'privacy' | 'shuffle'>('profile')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const updateNestedPreference = (section: keyof UserPreferences, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const savePreferences = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
    alert('Preferences saved successfully!')
  }

  const resetToDefaults = () => {
    setPreferences(defaultPreferences)
    setHasChanges(true)
  }

  const ToggleSwitch = ({ enabled, onChange, label, description }: {
    enabled: boolean
    onChange: (value: boolean) => void
    label: string
    description?: string
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && <div className="text-sm text-gray-400">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-primary-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const sectionIcons = {
    profile: User,
    cultural: Heart,
    platforms: Monitor,
    viewing: Eye,
    notifications: Bell,
    privacy: Shield,
    shuffle: Zap
  }

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'cultural', name: 'Cultural Content', icon: Heart },
    { id: 'platforms', name: 'Platforms', icon: Monitor },
    { id: 'viewing', name: 'Viewing', icon: Eye },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'shuffle', name: 'Shuffle', icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
              <Settings className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Preferences</h1>
          <p className="text-gray-400">Customize your ShuffleStream experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 sticky top-8">
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-500 text-white'
                          : 'hover:bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.name}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Profile Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <img
                        src={preferences.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-4 border-gray-600"
                      />
                      <div>
                        <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors">
                          Change Avatar
                        </button>
                        <p className="text-sm text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                          type="text"
                          value={preferences.username}
                          onChange={(e) => updatePreference('username', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Display Name</label>
                        <input
                          type="text"
                          value={preferences.displayName}
                          onChange={(e) => updatePreference('displayName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={preferences.email}
                        onChange={(e) => updatePreference('email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        value={preferences.bio}
                        onChange={(e) => updatePreference('bio', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cultural Content Section */}
              {activeSection === 'cultural' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="w-6 h-6" />
                    Cultural Content Preferences
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-400">Content Visibility Settings</h3>
                          <p className="text-sm text-blue-300/80">
                            Control what types of cultural content appear in your recommendations and shuffle results.
                          </p>
                        </div>
                      </div>
                    </div>

                    <ToggleSwitch
                      enabled={preferences.culturalContent.prideContent}
                      onChange={(value) => updateNestedPreference('culturalContent', 'prideContent', value)}
                      label="Pride & LGBTQ+ Content"
                      description="Show content celebrating LGBTQ+ themes and stories"
                    />

                    <ToggleSwitch
                      enabled={preferences.culturalContent.religiousContent}
                      onChange={(value) => updateNestedPreference('culturalContent', 'religiousContent', value)}
                      label="Religious Content"
                      description="Include faith-based and religious themed content"
                    />

                    <ToggleSwitch
                      enabled={preferences.culturalContent.politicalContent}
                      onChange={(value) => updateNestedPreference('culturalContent', 'politicalContent', value)}
                      label="Political Content"
                      description="Show documentaries and content with political themes"
                    />

                    <ToggleSwitch
                      enabled={preferences.culturalContent.socialJusticeContent}
                      onChange={(value) => updateNestedPreference('culturalContent', 'socialJusticeContent', value)}
                      label="Social Justice Content"
                      description="Include content addressing social issues and justice"
                    />

                    <ToggleSwitch
                      enabled={preferences.culturalContent.matureContent}
                      onChange={(value) => updateNestedPreference('culturalContent', 'matureContent', value)}
                      label="Mature Content"
                      description="Show content rated for mature audiences"
                    />

                    <ToggleSwitch
                      enabled={preferences.culturalContent.internationalContent}
                      onChange={(value) => updateNestedPreference('culturalContent', 'internationalContent', value)}
                      label="International Content"
                      description="Include foreign language and international productions"
                    />
                  </div>
                </div>
              )}

              {/* Platform Preferences */}
              {activeSection === 'platforms' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Monitor className="w-6 h-6" />
                    Platform Preferences
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-gray-400 mb-6">
                      Select which streaming platforms you have access to. This helps us provide better recommendations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(preferences.platforms).map(([platform, enabled]) => (
                        <ToggleSwitch
                          key={platform}
                          enabled={enabled}
                          onChange={(value) => updateNestedPreference('platforms', platform, value)}
                          label={platform === 'hboMax' ? 'HBO Max' : platform === 'amazonPrime' ? 'Amazon Prime' : platform === 'appleTV' ? 'Apple TV+' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Viewing Preferences */}
              {activeSection === 'viewing' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Eye className="w-6 h-6" />
                    Viewing Preferences
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Playback Settings</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.viewing.autoplay}
                        onChange={(value) => updateNestedPreference('viewing', 'autoplay', value)}
                        label="Autoplay Next Episode"
                        description="Automatically start the next episode"
                      />

                      <ToggleSwitch
                        enabled={preferences.viewing.skipIntros}
                        onChange={(value) => updateNestedPreference('viewing', 'skipIntros', value)}
                        label="Skip Intros"
                        description="Automatically skip opening credits"
                      />

                      <ToggleSwitch
                        enabled={preferences.viewing.skipCredits}
                        onChange={(value) => updateNestedPreference('viewing', 'skipCredits', value)}
                        label="Skip Credits"
                        description="Automatically skip end credits"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Accessibility</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.viewing.subtitles}
                        onChange={(value) => updateNestedPreference('viewing', 'subtitles', value)}
                        label="Subtitles"
                        description="Show subtitles by default"
                      />

                      <ToggleSwitch
                        enabled={preferences.viewing.audioDescription}
                        onChange={(value) => updateNestedPreference('viewing', 'audioDescription', value)}
                        label="Audio Description"
                        description="Enable audio descriptions when available"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Preferred Language</label>
                        <select
                          value={preferences.viewing.preferredLanguage}
                          onChange={(e) => updateNestedPreference('viewing', 'preferredLanguage', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Korean">Korean</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Preferred Quality</label>
                        <select
                          value={preferences.viewing.preferredQuality}
                          onChange={(e) => updateNestedPreference('viewing', 'preferredQuality', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                        >
                          <option value="Auto">Auto</option>
                          <option value="4K">4K Ultra HD</option>
                          <option value="HD">HD (1080p)</option>
                          <option value="SD">SD (720p)</option>
                        </select>
                      </div>
                    </div>

                    <ToggleSwitch
                      enabled={preferences.viewing.darkMode}
                      onChange={(value) => updateNestedPreference('viewing', 'darkMode', value)}
                      label="Dark Mode"
                      description="Use dark theme throughout the app"
                    />
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Bell className="w-6 h-6" />
                    Notification Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Delivery Methods</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.notifications.email}
                        onChange={(value) => updateNestedPreference('notifications', 'email', value)}
                        label="Email Notifications"
                        description="Receive notifications via email"
                      />

                      <ToggleSwitch
                        enabled={preferences.notifications.push}
                        onChange={(value) => updateNestedPreference('notifications', 'push', value)}
                        label="Push Notifications"
                        description="Receive push notifications on your device"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Content Notifications</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.notifications.newReleases}
                        onChange={(value) => updateNestedPreference('notifications', 'newReleases', value)}
                        label="New Releases"
                        description="Get notified about new shows and movies"
                      />

                      <ToggleSwitch
                        enabled={preferences.notifications.recommendations}
                        onChange={(value) => updateNestedPreference('notifications', 'recommendations', value)}
                        label="Personalized Recommendations"
                        description="Receive content suggestions based on your preferences"
                      />

                      <ToggleSwitch
                        enabled={preferences.notifications.achievements}
                        onChange={(value) => updateNestedPreference('notifications', 'achievements', value)}
                        label="Achievements"
                        description="Get notified when you unlock new achievements"
                      />

                      <ToggleSwitch
                        enabled={preferences.notifications.weeklyRecap}
                        onChange={(value) => updateNestedPreference('notifications', 'weeklyRecap', value)}
                        label="Weekly Recap"
                        description="Receive your weekly viewing summary"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Social Notifications</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.notifications.friendActivity}
                        onChange={(value) => updateNestedPreference('notifications', 'friendActivity', value)}
                        label="Friend Activity"
                        description="Get notified about your friends' viewing activity"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Marketing</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.notifications.marketingEmails}
                        onChange={(value) => updateNestedPreference('notifications', 'marketingEmails', value)}
                        label="Marketing Emails"
                        description="Receive promotional content and special offers"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Privacy Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                      <select
                        value={preferences.privacy.profileVisibility}
                        onChange={(e) => updateNestedPreference('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                      >
                        <option value="public">Public - Anyone can see your profile</option>
                        <option value="friends">Friends Only - Only friends can see your profile</option>
                        <option value="private">Private - Only you can see your profile</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Profile Information</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.privacy.showWatchHistory}
                        onChange={(value) => updateNestedPreference('privacy', 'showWatchHistory', value)}
                        label="Show Watch History"
                        description="Allow others to see what you've watched"
                      />

                      <ToggleSwitch
                        enabled={preferences.privacy.showFavorites}
                        onChange={(value) => updateNestedPreference('privacy', 'showFavorites', value)}
                        label="Show Favorites"
                        description="Display your favorite content on your profile"
                      />

                      <ToggleSwitch
                        enabled={preferences.privacy.shareViewingActivity}
                        onChange={(value) => updateNestedPreference('privacy', 'shareViewingActivity', value)}
                        label="Share Viewing Activity"
                        description="Let friends see what you're currently watching"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Social Features</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.privacy.allowFriendRequests}
                        onChange={(value) => updateNestedPreference('privacy', 'allowFriendRequests', value)}
                        label="Allow Friend Requests"
                        description="Let other users send you friend requests"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Data & Analytics</h3>
                      
                      <ToggleSwitch
                        enabled={preferences.privacy.dataCollection}
                        onChange={(value) => updateNestedPreference('privacy', 'dataCollection', value)}
                        label="Data Collection"
                        description="Allow us to collect usage data to improve the service"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shuffle Preferences */}
              {activeSection === 'shuffle' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Shuffle Preferences
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Default Shuffle Mode</label>
                      <select
                        value={preferences.shuffle.defaultMode}
                        onChange={(e) => updateNestedPreference('shuffle', 'defaultMode', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                      >
                        <option value="full">Full Shuffle - All available content</option>
                        <option value="preference">Preference Shuffle - Based on your preferences</option>
                        <option value="show">Show Shuffle - Random episodes from series</option>
                        <option value="list">List Shuffle - From your saved content</option>
                        <option value="platform">Platform Shuffle - Single platform only</option>
                      </select>
                    </div>

                    <ToggleSwitch
                      enabled={preferences.shuffle.excludeWatched}
                      onChange={(value) => updateNestedPreference('shuffle', 'excludeWatched', value)}
                      label="Exclude Already Watched"
                      description="Don't include content you've already seen"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Maximum Runtime (minutes)</label>
                        <input
                          type="number"
                          value={preferences.shuffle.maxRuntime}
                          onChange={(e) => updateNestedPreference('shuffle', 'maxRuntime', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                          min="30"
                          max="300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                        <input
                          type="number"
                          value={preferences.shuffle.minRating}
                          onChange={(e) => updateNestedPreference('shuffle', 'minRating', parseFloat(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none"
                          min="0"
                          max="10"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Favorite Genres</label>
                      <div className="flex flex-wrap gap-2">
                        {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy'].map(genre => (
                          <button
                            key={genre}
                            onClick={() => {
                              const current = preferences.shuffle.favoriteGenres
                              const updated = current.includes(genre)
                                ? current.filter(g => g !== genre)
                                : [...current, genre]
                              updateNestedPreference('shuffle', 'favoriteGenres', updated)
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              preferences.shuffle.favoriteGenres.includes(genre)
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Avoid Genres</label>
                      <div className="flex flex-wrap gap-2">
                        {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy'].map(genre => (
                          <button
                            key={genre}
                            onClick={() => {
                              const current = preferences.shuffle.avoidGenres
                              const updated = current.includes(genre)
                                ? current.filter(g => g !== genre)
                                : [...current, genre]
                              updateNestedPreference('shuffle', 'avoidGenres', updated)
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              preferences.shuffle.avoidGenres.includes(genre)
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Defaults
                  </button>
                  
                  <div className="flex items-center gap-4">
                    {hasChanges && (
                      <span className="text-sm text-yellow-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Unsaved changes
                      </span>
                    )}
                    <button
                      onClick={savePreferences}
                      disabled={!hasChanges || isSaving}
                      className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 