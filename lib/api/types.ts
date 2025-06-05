// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// User Types
export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatar?: string
  bio?: string
  joinedDate: Date
  lastActive: Date
  status: 'active' | 'suspended' | 'banned'
  subscription: 'free' | 'premium'
  preferences: UserPreferences
  stats: UserStats
}

export interface UserPreferences {
  culturalContent: {
    prideContent: boolean
    religiousContent: boolean
    politicalContent: boolean
    socialJusticeContent: boolean
    matureContent: boolean
    internationalContent: boolean
  }
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
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    showWatchHistory: boolean
    showFavorites: boolean
    allowFriendRequests: boolean
    shareViewingActivity: boolean
    dataCollection: boolean
  }
  shuffle: {
    defaultMode: 'full' | 'preference' | 'show' | 'list' | 'platform'
    excludeWatched: boolean
    favoriteGenres: string[]
    avoidGenres: string[]
    maxRuntime: number
    minRating: number
  }
}

export interface UserStats {
  totalWatchTime: number
  totalTitles: number
  averageSessionTime: number
  longestSession: number
  streakDays: number
  favoriteGenre: string
  favoriteDay: string
  favoriteTime: string
  level: number
  achievements: string[]
  rank: number
}

// Content Types
export interface Content {
  id: string
  tmdbId?: number
  title: string
  type: 'movie' | 'tv' | 'documentary' | 'special'
  description: string
  genres: string[]
  releaseDate: Date
  runtime?: number
  rating: number
  ageRating: string
  language: string
  country: string
  poster: string
  backdrop: string
  trailer?: string
  platforms: Platform[]
  cast: CastMember[]
  crew: CrewMember[]
  seasons?: Season[]
  episodes?: Episode[]
  culturalTags: CulturalTag[]
  status: 'active' | 'pending' | 'flagged' | 'removed'
  addedDate: Date
  updatedDate: Date
  views: number
  averageRating: number
  reports: number
}

export interface Platform {
  id: string
  name: string
  logo: string
  baseUrl: string
  deepLinkPattern: string
  isActive: boolean
}

export interface CastMember {
  id: string
  name: string
  character: string
  profileImage?: string
  order: number
}

export interface CrewMember {
  id: string
  name: string
  job: string
  department: string
  profileImage?: string
}

export interface Season {
  id: string
  seasonNumber: number
  name: string
  description: string
  episodeCount: number
  airDate: Date
  poster?: string
}

export interface Episode {
  id: string
  seasonId: string
  episodeNumber: number
  name: string
  description: string
  airDate: Date
  runtime: number
  stillImage?: string
  rating?: number
}

export interface CulturalTag {
  id: string
  name: string
  category: 'pride' | 'religious' | 'political' | 'social-justice' | 'cultural'
  description: string
}

// Shuffle Types
export interface ShuffleRequest {
  mode: 'full' | 'preference' | 'show' | 'list' | 'platform'
  userId: string
  filters?: ShuffleFilters
  excludeWatched?: boolean
  limit?: number
}

export interface ShuffleFilters {
  genres?: string[]
  platforms?: string[]
  minRating?: number
  maxRuntime?: number
  releaseYearRange?: [number, number]
  contentTypes?: ('movie' | 'tv' | 'documentary')[]
  culturalTags?: string[]
}

export interface ShuffleResult {
  content: Content
  reason: string
  confidence: number
  alternatives: Content[]
}

// User Lists Types
export interface UserList {
  id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  contentIds: string[]
  createdDate: Date
  updatedDate: Date
  tags: string[]
  collaborators?: string[]
}

export interface ShufflePack {
  id: string
  userId: string
  name: string
  description: string
  theme: string
  contentIds: string[]
  isPublic: boolean
  tags: string[]
  createdDate: Date
  updatedDate: Date
  likes: number
  uses: number
}

// Viewing History Types
export interface ViewingSession {
  id: string
  userId: string
  contentId: string
  startTime: Date
  endTime?: Date
  duration: number
  progress: number
  platform: string
  deviceType: string
  completed: boolean
}

export interface WatchHistory {
  id: string
  userId: string
  contentId: string
  watchedDate: Date
  rating?: number
  review?: string
  progress: number
  platform: string
}

// Social Types
export interface Friendship {
  id: string
  userId: string
  friendId: string
  status: 'pending' | 'accepted' | 'blocked'
  createdDate: Date
}

export interface UserActivity {
  id: string
  userId: string
  type: 'watched' | 'rated' | 'reviewed' | 'added_to_list' | 'achievement'
  contentId?: string
  data: any
  timestamp: Date
  isPublic: boolean
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string
  username: string
  avatar: string
  score: number
  rank: number
  change: number
  stats: {
    watchTime: number
    contentWatched: number
    streakDays: number
    level: number
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  criteria: any
  points: number
  unlockedBy: number
}

// Analytics Types
export interface PlatformAnalytics {
  platformId: string
  totalViews: number
  totalWatchTime: number
  uniqueUsers: number
  topContent: string[]
  averageRating: number
  period: string
}

export interface ContentAnalytics {
  contentId: string
  views: number
  watchTime: number
  completionRate: number
  averageRating: number
  demographics: {
    ageGroups: Record<string, number>
    genders: Record<string, number>
    regions: Record<string, number>
  }
  period: string
}

// Admin Types
export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'super_admin' | 'content_moderator' | 'user_moderator' | 'analytics_viewer'
  permissions: string[]
  lastLogin: Date
  isActive: boolean
}

export interface ContentReport {
  id: string
  contentId: string
  reporterId: string
  reason: string
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdDate: Date
  reviewedBy?: string
  reviewedDate?: Date
  resolution?: string
}

export interface UserReport {
  id: string
  reportedUserId: string
  reporterId: string
  reason: string
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdDate: Date
  reviewedBy?: string
  reviewedDate?: Date
  action?: string
}

// API Endpoints Types
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string
  backdrop_path: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
  runtime?: number
  adult: boolean
  original_language: string
  original_title: string
}

export interface TMDBTVShow {
  id: number
  name: string
  overview: string
  first_air_date: string
  poster_path: string
  backdrop_path: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
  adult: boolean
  original_language: string
  original_name: string
  number_of_seasons?: number
  number_of_episodes?: number
}

export interface TMDBGenre {
  id: number
  name: string
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Search Types
export interface SearchRequest {
  query: string
  filters?: {
    type?: ('movie' | 'tv' | 'documentary')[]
    genres?: string[]
    platforms?: string[]
    minRating?: number
    maxRuntime?: number
    releaseYearRange?: [number, number]
  }
  sort?: 'relevance' | 'rating' | 'release_date' | 'popularity'
  page?: number
  limit?: number
}

export interface SearchResult {
  content: Content[]
  total: number
  suggestions: string[]
  filters: {
    availableGenres: string[]
    availablePlatforms: string[]
    yearRange: [number, number]
  }
} 