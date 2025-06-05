'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  Award,
  Target,
  Zap,
  Flame,
  Eye,
  Heart,
  Share2,
  Filter,
  Search
} from 'lucide-react'

interface User {
  id: string
  username: string
  avatar: string
  totalWatchTime: number // in minutes
  contentWatched: number
  streakDays: number
  favoriteGenre: string
  joinedDate: Date
  level: number
  badges: string[]
  rank: number
  weeklyWatchTime: number
  monthlyWatchTime: number
}

interface ContentStats {
  id: string
  title: string
  platform: string
  genre: string[]
  totalViews: number
  averageRating: number
  watchTime: number
  image: string
  ageRange: string
  trending: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedBy: number
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'StreamMaster',
    avatar: '/api/placeholder/64/64',
    totalWatchTime: 15420, // 257 hours
    contentWatched: 342,
    streakDays: 45,
    favoriteGenre: 'Sci-Fi',
    joinedDate: new Date('2023-06-15'),
    level: 28,
    badges: ['binge-lord', 'genre-explorer', 'early-adopter'],
    rank: 1,
    weeklyWatchTime: 2100,
    monthlyWatchTime: 8400
  },
  {
    id: '2',
    username: 'CouchPotato',
    avatar: '/api/placeholder/64/64',
    totalWatchTime: 14850,
    contentWatched: 298,
    streakDays: 32,
    favoriteGenre: 'Comedy',
    joinedDate: new Date('2023-07-22'),
    level: 26,
    badges: ['comedy-king', 'weekend-warrior'],
    rank: 2,
    weeklyWatchTime: 1950,
    monthlyWatchTime: 7800
  },
  {
    id: '3',
    username: 'SeriesAddict',
    avatar: '/api/placeholder/64/64',
    totalWatchTime: 13200,
    contentWatched: 445,
    streakDays: 28,
    favoriteGenre: 'Drama',
    joinedDate: new Date('2023-08-10'),
    level: 24,
    badges: ['series-specialist', 'drama-devotee'],
    rank: 3,
    weeklyWatchTime: 1800,
    monthlyWatchTime: 7200
  },
  {
    id: '4',
    username: 'MovieBuff',
    avatar: '/api/placeholder/64/64',
    totalWatchTime: 11900,
    contentWatched: 189,
    streakDays: 21,
    favoriteGenre: 'Action',
    joinedDate: new Date('2023-09-05'),
    level: 22,
    badges: ['movie-maven', 'action-hero'],
    rank: 4,
    weeklyWatchTime: 1650,
    monthlyWatchTime: 6600
  },
  {
    id: '5',
    username: 'DocuFan',
    avatar: '/api/placeholder/64/64',
    totalWatchTime: 10800,
    contentWatched: 156,
    streakDays: 19,
    favoriteGenre: 'Documentary',
    joinedDate: new Date('2023-10-12'),
    level: 20,
    badges: ['knowledge-seeker', 'documentary-devotee'],
    rank: 5,
    weeklyWatchTime: 1500,
    monthlyWatchTime: 6000
  }
]

const mockTrendingContent: ContentStats[] = [
  {
    id: '1',
    title: 'Stranger Things',
    platform: 'Netflix',
    genre: ['Sci-Fi', 'Horror'],
    totalViews: 15420,
    averageRating: 8.7,
    watchTime: 785400, // total minutes watched by all users
    image: '/api/placeholder/300/450',
    ageRange: '16-35',
    trending: true
  },
  {
    id: '2',
    title: 'The Office',
    platform: 'Peacock',
    genre: ['Comedy'],
    totalViews: 12850,
    averageRating: 9.0,
    watchTime: 642500,
    image: '/api/placeholder/300/450',
    ageRange: '18-45',
    trending: true
  },
  {
    id: '3',
    title: 'Planet Earth',
    platform: 'BBC',
    genre: ['Documentary'],
    totalViews: 8900,
    averageRating: 9.4,
    watchTime: 445000,
    image: '/api/placeholder/300/450',
    ageRange: '25-55',
    trending: false
  }
]

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Binge Lord',
    description: 'Watch 100+ hours in a month',
    icon: '👑',
    rarity: 'legendary',
    unlockedBy: 12
  },
  {
    id: '2',
    name: 'Genre Explorer',
    description: 'Watch content from 10+ different genres',
    icon: '🗺️',
    rarity: 'epic',
    unlockedBy: 45
  },
  {
    id: '3',
    name: 'Early Adopter',
    description: 'Join ShuffleStream in the first month',
    icon: '🚀',
    rarity: 'rare',
    unlockedBy: 156
  },
  {
    id: '4',
    name: 'Weekend Warrior',
    description: 'Watch 20+ hours every weekend for a month',
    icon: '⚔️',
    rarity: 'epic',
    unlockedBy: 28
  }
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'achievements'>('users')
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'alltime'>('monthly')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Medal className="w-6 h-6 text-amber-600" />
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>
    }
  }

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const formatWatchTime = (minutes: number) => {
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

  const getWatchTimeForFilter = (user: User) => {
    switch (timeFilter) {
      case 'weekly': return user.weeklyWatchTime
      case 'monthly': return user.monthlyWatchTime
      case 'alltime': return user.totalWatchTime
      default: return user.monthlyWatchTime
    }
  }

  const filteredUsers = mockUsers
    .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => getWatchTimeForFilter(b) - getWatchTimeForFilter(a))
    .map((user, index) => ({ ...user, rank: index + 1 }))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-3">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Binger Leaderboard</h1>
          <p className="text-gray-400">Compete with fellow streamers and earn achievements</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded transition-colors ${
                activeTab === 'users' ? 'bg-primary-500' : 'hover:bg-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Top Bingers
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 rounded transition-colors ${
                activeTab === 'content' ? 'bg-primary-500' : 'hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Trending Content
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-3 rounded transition-colors ${
                activeTab === 'achievements' ? 'bg-primary-500' : 'hover:bg-gray-700'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Achievements
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                {(['weekly', 'monthly', 'alltime'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      timeFilter === filter
                        ? 'bg-primary-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {filter === 'alltime' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {filteredUsers.slice(0, 3).map((user, index) => (
                <motion.div
                  key={user.id}
                  className={`relative bg-gradient-to-br ${
                    index === 0 ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50' :
                    index === 1 ? 'from-gray-400/20 to-gray-500/20 border-gray-400/50' :
                    'from-amber-600/20 to-amber-700/20 border-amber-600/50'
                  } border rounded-xl p-6 text-center`}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    {getRankIcon(index + 1)}
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white/20"
                  />
                  <h3 className="text-xl font-bold mb-2">{user.username}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatWatchTime(getWatchTimeForFilter(user))}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Level {user.level}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{user.streakDays} day streak</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mt-4">
                    {user.badges.slice(0, 3).map(badge => (
                      <div key={badge} className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs">
                        🏆
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Full Leaderboard */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold">Full Rankings</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {filteredUsers.slice(3).map((user, index) => (
                  <motion.div
                    key={user.id}
                    className="p-6 hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                        <span className="font-bold text-sm">{user.rank}</span>
                      </div>
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{user.username}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Level {user.level}</span>
                          <span>{user.favoriteGenre}</span>
                          <span>{user.streakDays} day streak</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatWatchTime(getWatchTimeForFilter(user))}</div>
                        <div className="text-sm text-gray-400">{user.contentWatched} titles</div>
                      </div>
                      <div className="flex gap-1">
                        {user.badges.slice(0, 2).map(badge => (
                          <div key={badge} className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs">
                            🏆
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTrendingContent.map((content, index) => (
                <motion.div
                  key={content.id}
                  className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-full h-48 object-cover"
                    />
                    {content.trending && (
                      <div className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full text-xs font-semibold">
                        🔥 Trending
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-sm">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-primary-500 px-2 py-1 rounded text-sm">{content.platform}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{content.averageRating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{content.totalViews.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatWatchTime(content.watchTime)} total watched</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Popular with {content.ageRange}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {content.genre.map(g => (
                        <span key={g} className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className={`bg-gradient-to-br ${getBadgeColor(achievement.rarity)} rounded-xl p-6 text-center border border-white/20`}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{achievement.name}</h3>
                  <p className="text-sm text-white/80 mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                      achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                      achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    <span className="text-xs text-white/60">
                      {achievement.unlockedBy} users
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">How to Earn Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-primary-400">Watch Time Achievements</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Watch 10 hours → Night Owl</li>
                    <li>• Watch 50 hours → Dedicated Viewer</li>
                    <li>• Watch 100 hours → Binge Master</li>
                    <li>• Watch 500 hours → Streaming Legend</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary-400">Social Achievements</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Share 10 recommendations → Influencer</li>
                    <li>• Create 5 shuffle packs → Curator</li>
                    <li>• Maintain 30-day streak → Consistency King</li>
                    <li>• Rate 100 titles → Critic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 