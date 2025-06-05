'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Star, 
  Award, 
  Target,
  BarChart3,
  PieChart,
  Download,
  Share2,
  Eye,
  Heart,
  Zap,
  Crown,
  Users,
  Film,
  Tv,
  Globe,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface ViewingStats {
  totalWatchTime: number // in minutes
  totalTitles: number
  averageSessionTime: number
  longestSession: number
  streakDays: number
  favoriteGenre: string
  favoriteDay: string
  favoriteTime: string
  platformBreakdown: { platform: string; hours: number; percentage: number }[]
  genreBreakdown: { genre: string; hours: number; percentage: number }[]
  monthlyStats: { month: string; hours: number; titles: number }[]
  topTitles: { title: string; platform: string; hours: number; episodes?: number }[]
  achievements: string[]
  yearOverYear: {
    watchTime: { current: number; previous: number; change: number }
    titles: { current: number; previous: number; change: number }
    genres: { current: number; previous: number; change: number }
  }
}

interface PersonalInsight {
  id: string
  type: 'achievement' | 'milestone' | 'trend' | 'recommendation'
  title: string
  description: string
  icon: string
  value?: string
  comparison?: string
}

// Mock data for 2024 recap
const mockStats: ViewingStats = {
  totalWatchTime: 18420, // 307 hours
  totalTitles: 156,
  averageSessionTime: 95, // minutes
  longestSession: 480, // 8 hours
  streakDays: 45,
  favoriteGenre: 'Sci-Fi',
  favoriteDay: 'Saturday',
  favoriteTime: '8:00 PM',
  platformBreakdown: [
    { platform: 'Netflix', hours: 125, percentage: 40.7 },
    { platform: 'Disney+', hours: 89, percentage: 29.0 },
    { platform: 'HBO Max', hours: 56, percentage: 18.2 },
    { platform: 'Hulu', hours: 37, percentage: 12.1 }
  ],
  genreBreakdown: [
    { genre: 'Sci-Fi', hours: 78, percentage: 25.4 },
    { genre: 'Drama', hours: 65, percentage: 21.2 },
    { genre: 'Comedy', hours: 52, percentage: 16.9 },
    { genre: 'Action', hours: 48, percentage: 15.6 },
    { genre: 'Documentary', hours: 34, percentage: 11.1 },
    { genre: 'Horror', hours: 30, percentage: 9.8 }
  ],
  monthlyStats: [
    { month: 'Jan', hours: 28, titles: 12 },
    { month: 'Feb', hours: 24, titles: 10 },
    { month: 'Mar', hours: 32, titles: 15 },
    { month: 'Apr', hours: 26, titles: 11 },
    { month: 'May', hours: 35, titles: 18 },
    { month: 'Jun', hours: 29, titles: 13 },
    { month: 'Jul', hours: 38, titles: 16 },
    { month: 'Aug', hours: 31, titles: 14 },
    { month: 'Sep', hours: 27, titles: 12 },
    { month: 'Oct', hours: 33, titles: 15 },
    { month: 'Nov', hours: 25, titles: 11 },
    { month: 'Dec', hours: 19, titles: 9 }
  ],
  topTitles: [
    { title: 'Stranger Things', platform: 'Netflix', hours: 24, episodes: 34 },
    { title: 'The Mandalorian', platform: 'Disney+', hours: 18, episodes: 24 },
    { title: 'House of the Dragon', platform: 'HBO Max', hours: 16, episodes: 10 },
    { title: 'The Bear', platform: 'Hulu', hours: 14, episodes: 28 },
    { title: 'Wednesday', platform: 'Netflix', hours: 12, episodes: 8 }
  ],
  achievements: ['Binge Master', 'Genre Explorer', 'Streak Keeper', 'Platform Hopper'],
  yearOverYear: {
    watchTime: { current: 307, previous: 245, change: 25.3 },
    titles: { current: 156, previous: 134, change: 16.4 },
    genres: { current: 12, previous: 9, change: 33.3 }
  }
}

const personalInsights: PersonalInsight[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Binge Master Unlocked!',
    description: 'You watched 8 hours straight during your longest session',
    icon: '🏆',
    value: '8 hours'
  },
  {
    id: '2',
    type: 'trend',
    title: 'Sci-Fi Superfan',
    description: 'You spent 25% of your time exploring other worlds',
    icon: '🚀',
    value: '78 hours',
    comparison: '+15% vs last year'
  },
  {
    id: '3',
    type: 'milestone',
    title: 'Consistency Champion',
    description: 'Your longest viewing streak was 45 days',
    icon: '🔥',
    value: '45 days'
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'Branch Out Suggestion',
    description: 'Try more documentaries - you might love them!',
    icon: '💡',
    comparison: 'Only 11% of your time'
  }
]

export default function RecapPage() {
  const [selectedYear, setSelectedYear] = useState(2024)
  const [activeSection, setActiveSection] = useState<'overview' | 'detailed' | 'insights'>('overview')
  const [isSharing, setIsSharing] = useState(false)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else {
      return `${minutes}m`
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const shareRecap = () => {
    setIsSharing(true)
    // Simulate sharing
    setTimeout(() => {
      setIsSharing(false)
      alert('Recap shared successfully!')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Your {selectedYear} Recap</h1>
          <p className="text-gray-400">A year of amazing content and discoveries</p>
        </div>

        {/* Year Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
            {[2024, 2023, 2022].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedYear === year ? 'bg-primary-500' : 'hover:bg-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-6 py-3 rounded transition-colors ${
                activeSection === 'overview' ? 'bg-primary-500' : 'hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveSection('detailed')}
              className={`px-6 py-3 rounded transition-colors ${
                activeSection === 'detailed' ? 'bg-primary-500' : 'hover:bg-gray-700'
              }`}
            >
              <PieChart className="w-4 h-4 inline mr-2" />
              Detailed Stats
            </button>
            <button
              onClick={() => setActiveSection('insights')}
              className={`px-6 py-3 rounded transition-colors ${
                activeSection === 'insights' ? 'bg-primary-500' : 'hover:bg-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Personal Insights
            </button>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Clock className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-3xl font-bold mb-1">{Math.floor(mockStats.totalWatchTime / 60)}</div>
                <div className="text-sm text-gray-400">Hours Watched</div>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm">
                  {getChangeIcon(mockStats.yearOverYear.watchTime.change)}
                  <span className={getChangeColor(mockStats.yearOverYear.watchTime.change)}>
                    {mockStats.yearOverYear.watchTime.change > 0 ? '+' : ''}{mockStats.yearOverYear.watchTime.change}%
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Film className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <div className="text-3xl font-bold mb-1">{mockStats.totalTitles}</div>
                <div className="text-sm text-gray-400">Titles Watched</div>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm">
                  {getChangeIcon(mockStats.yearOverYear.titles.change)}
                  <span className={getChangeColor(mockStats.yearOverYear.titles.change)}>
                    {mockStats.yearOverYear.titles.change > 0 ? '+' : ''}{mockStats.yearOverYear.titles.change}%
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Target className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl font-bold mb-1">{mockStats.genreBreakdown.length}</div>
                <div className="text-sm text-gray-400">Genres Explored</div>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm">
                  {getChangeIcon(mockStats.yearOverYear.genres.change)}
                  <span className={getChangeColor(mockStats.yearOverYear.genres.change)}>
                    {mockStats.yearOverYear.genres.change > 0 ? '+' : ''}{mockStats.yearOverYear.genres.change}%
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Zap className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                <div className="text-3xl font-bold mb-1">{mockStats.streakDays}</div>
                <div className="text-sm text-gray-400">Day Streak</div>
                <div className="text-xs text-orange-400 mt-2">Personal Best!</div>
              </motion.div>
            </div>

            {/* Top Content */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Your Top 5 Shows & Movies
              </h3>
              <div className="space-y-4">
                {mockStats.topTitles.map((title, index) => (
                  <motion.div
                    key={title.title}
                    className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-500 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{title.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{title.platform}</span>
                        {title.episodes && <span>{title.episodes} episodes</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{title.hours}h</div>
                      <div className="text-sm text-gray-400">watched</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Favorite Genre
                </h4>
                <div className="text-2xl font-bold text-primary-400">{mockStats.favoriteGenre}</div>
                <div className="text-sm text-gray-400">
                  {mockStats.genreBreakdown[0].percentage}% of your time
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Favorite Day
                </h4>
                <div className="text-2xl font-bold text-primary-400">{mockStats.favoriteDay}</div>
                <div className="text-sm text-gray-400">
                  Peak binge day
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  Longest Session
                </h4>
                <div className="text-2xl font-bold text-primary-400">{formatTime(mockStats.longestSession)}</div>
                <div className="text-sm text-gray-400">
                  Marathon mode activated!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats Section */}
        {activeSection === 'detailed' && (
          <div className="space-y-8">
            {/* Platform Breakdown */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6">Platform Breakdown</h3>
              <div className="space-y-4">
                {mockStats.platformBreakdown.map((platform, index) => (
                  <motion.div
                    key={platform.platform}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{platform.platform}</span>
                      <span className="text-sm text-gray-400">{platform.hours}h ({platform.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-primary-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${platform.percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Genre Breakdown */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6">Genre Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockStats.genreBreakdown.map((genre, index) => (
                  <motion.div
                    key={genre.genre}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <div className="font-semibold">{genre.genre}</div>
                      <div className="text-sm text-gray-400">{genre.hours} hours</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-400">{genre.percentage}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6">Monthly Viewing Trends</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockStats.monthlyStats.map((month, index) => (
                  <motion.div
                    key={month.month}
                    className="text-center p-4 bg-gray-700/30 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="text-sm text-gray-400 mb-1">{month.month}</div>
                    <div className="text-lg font-bold">{month.hours}h</div>
                    <div className="text-xs text-gray-500">{month.titles} titles</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personal Insights Section */}
        {activeSection === 'insights' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  className={`p-6 rounded-xl border ${
                    insight.type === 'achievement' ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' :
                    insight.type === 'milestone' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50' :
                    insight.type === 'trend' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50' :
                    'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{insight.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                      <p className="text-gray-300 mb-3">{insight.description}</p>
                      <div className="flex items-center gap-4">
                        {insight.value && (
                          <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
                            {insight.value}
                          </span>
                        )}
                        {insight.comparison && (
                          <span className="text-sm text-gray-400">{insight.comparison}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Achievements */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements Unlocked This Year
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockStats.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-sm font-medium">{achievement}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6">For Next Year</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <Globe className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                  <h4 className="font-semibold mb-2">Explore International</h4>
                  <p className="text-sm text-gray-400">Try content from different countries</p>
                </div>
                <div className="text-center p-4">
                  <Users className="w-8 h-8 mx-auto mb-3 text-green-400" />
                  <h4 className="font-semibold mb-2">Social Viewing</h4>
                  <p className="text-sm text-gray-400">Watch with friends and family more</p>
                </div>
                <div className="text-center p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                  <h4 className="font-semibold mb-2">Try New Genres</h4>
                  <p className="text-sm text-gray-400">Branch out from your comfort zone</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={shareRecap}
            disabled={isSharing}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 px-6 py-3 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {isSharing ? 'Sharing...' : 'Share Recap'}
          </button>
          <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
} 