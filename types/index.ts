import { Database } from './database'

export type Tables = Database['public']['Tables']
export type DbUser = Tables['users']['Row']
export type DbTitle = Tables['titles']['Row']
export type DbWatchedTitle = Tables['watched_titles']['Row']
export type DbShufflePack = Tables['shuffle_packs']['Row']
export type DbLeaderboard = Tables['leaderboard']['Row']
export type DbUserPreferences = Tables['user_preferences']['Row']

export type User = DbUser
export type UserPreferences = DbUserPreferences
export type Title = DbTitle
export type WatchedTitle = DbWatchedTitle
export type ShufflePack = DbShufflePack
export type LeaderboardEntry = DbLeaderboard
export type Favorite = DbUserPreferences
export type RecapData = DbUserPreferences

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
export type ContentType = 'movie' | 'series' | 'episode'
export type PlatformType = 'netflix' | 'disney+' | 'hulu' | 'prime' | 'hbo' | 'apple' | 'paramount' | 'peacock'

export type Platform = {
  id: PlatformType;
  name: string;
  color: string;
  deepLinkPrefix: string;
  isConnected: boolean;
}

export type Content = {
  id: string;
  title: string;
  type: ContentType;
  platformId: PlatformType;
  genres: Genre[];
  releaseYear: number;
  rating: string;
  duration: number; // in minutes
  deepLinkUrl: string;
  thumbnailUrl: string;
  description: string;
  // For series
  totalSeasons?: number;
  totalEpisodes?: number;
  // For episodes
  seasonNumber?: number;
  episodeNumber?: number;
  seriesId?: string;
}

export type ShufflePreferences = {
  genres: string[];
  minRating: number;
  maxDuration: number;
  contentTypes: ContentType[];
  excludedPlatforms: PlatformType[];
}

export type ShuffleState = {
  mode: ShuffleModeType | null;
  isPlaying: boolean;
  currentContent: Content | null;
  queue: Content[];
  history: Content[];
}

export type UserList = Omit<DbShufflePack, 'created_at' | 'updated_at'> & {
  createdAt: Date;
  updatedAt: Date;
}

export type ViewingHistory = Omit<DbWatchedTitle, 'watched_at'> & {
  watchedAt: Date;
  progress: number; // percentage
}

// Cultural themes are managed through user preferences in the database
export type CulturalPreferences = {
  userId: string;
  culturalThemes: {
    pride: boolean;
    religious: boolean;
    political: boolean;
    socialJustice: boolean;
  };
  thematicUI: boolean;
  updatedAt: Date;
}

// Challenge data is derived from leaderboard and watched_titles
export type Challenge = {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  reward?: string;
}

export * from './database' 