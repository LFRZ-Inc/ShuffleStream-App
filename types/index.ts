import { Database } from './database'

export type User = Database['public']['Tables']['users']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type Title = Database['public']['Tables']['titles']['Row']
export type WatchedTitle = Database['public']['Tables']['watched_titles']['Row']
export type ShufflePack = Database['public']['Tables']['shuffle_packs']['Row']
export type LeaderboardEntry = Database['public']['Tables']['leaderboard']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type RecapData = Database['public']['Tables']['recap_data']['Row']

export interface StreamingPlatform {
  id: string
  name: string
  icon: string
  color: string
  deepLinkBase: string
}

export interface Genre {
  id: string
  name: string
  icon: string
}

export interface ShuffleMode {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export interface CulturalTheme {
  id: string
  name: string
  description: string
  icon: string
  color: string
  preferenceKey: keyof Omit<UserPreferences, 'user_id' | 'created_at' | 'updated_at'>
}

export interface BingerChallenge {
  currentCount: number
  targetCount: number
  level: string
  nextReward: string
  progress: number
}

export interface RecapStats {
  totalTitles: number
  totalHours: number
  topPlatform: string
  topGenre: string
  favoriteTitle: Title | null
  streakDays: number
  monthlyBreakdown: Array<{
    month: string
    count: number
  }>
  genreBreakdown: Array<{
    genre: string
    count: number
    percentage: number
  }>
  platformBreakdown: Array<{
    platform: string
    count: number
    percentage: number
  }>
}

export interface ShuffleResult {
  title: Title
  reason: string
  confidence: number
}

export interface NotificationSettings {
  newContent: boolean
  challenges: boolean
  leaderboard: boolean
  recap: boolean
  marketing: boolean
}

export interface AppState {
  user: User | null
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null
}

export type ShuffleModeType = 'full' | 'preference' | 'cable' | 'list' | 'show'
export type ContentType = 'movie' | 'tv' | 'music'
export type PlatformType = 'netflix' | 'disney+' | 'hulu' | 'prime' | 'hbo' | 'apple' | 'paramount' | 'peacock' | 'spotify' | 'youtube'

export * from './database' 