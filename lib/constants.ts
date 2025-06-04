import { StreamingPlatform, Genre, ShuffleMode, CulturalTheme } from '@/types'

export const STREAMING_PLATFORMS: StreamingPlatform[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    icon: '🎬',
    color: '#E50914',
    deepLinkBase: 'https://www.netflix.com/title/'
  },
  {
    id: 'disney+',
    name: 'Disney+',
    icon: '🏰',
    color: '#113CCF',
    deepLinkBase: 'https://www.disneyplus.com/movies/'
  },
  {
    id: 'hulu',
    name: 'Hulu',
    icon: '📺',
    color: '#1CE783',
    deepLinkBase: 'https://www.hulu.com/watch/'
  },
  {
    id: 'prime',
    name: 'Prime Video',
    icon: '📦',
    color: '#00A8E1',
    deepLinkBase: 'https://www.amazon.com/gp/video/detail/'
  },
  {
    id: 'hbo',
    name: 'HBO Max',
    icon: '👑',
    color: '#8B5CF6',
    deepLinkBase: 'https://play.hbomax.com/page/'
  },
  {
    id: 'apple',
    name: 'Apple TV+',
    icon: '🍎',
    color: '#000000',
    deepLinkBase: 'https://tv.apple.com/movie/'
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    icon: '⭐',
    color: '#0064FF',
    deepLinkBase: 'https://www.paramountplus.com/movies/'
  },
  {
    id: 'peacock',
    name: 'Peacock',
    icon: '🦚',
    color: '#FA6400',
    deepLinkBase: 'https://www.peacocktv.com/watch/playback/'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    color: '#1DB954',
    deepLinkBase: 'https://open.spotify.com/album/'
  },
  {
    id: 'youtube',
    name: 'YouTube Music',
    icon: '🎶',
    color: '#FF0000',
    deepLinkBase: 'https://music.youtube.com/watch?v='
  }
]

export const GENRES: Genre[] = [
  { id: 'action', name: 'Action', icon: '💥' },
  { id: 'adventure', name: 'Adventure', icon: '🗺️' },
  { id: 'animation', name: 'Animation', icon: '🎨' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'crime', name: 'Crime', icon: '🔍' },
  { id: 'documentary', name: 'Documentary', icon: '📹' },
  { id: 'drama', name: 'Drama', icon: '🎭' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'mystery', name: 'Mystery', icon: '🔎' },
  { id: 'romance', name: 'Romance', icon: '💕' },
  { id: 'sci-fi', name: 'Science Fiction', icon: '🚀' },
  { id: 'thriller', name: 'Thriller', icon: '😰' },
  { id: 'war', name: 'War', icon: '⚔️' },
  { id: 'western', name: 'Western', icon: '🤠' }
]

export const SHUFFLE_MODES: ShuffleMode[] = [
  {
    id: 'full',
    name: 'Full Shuffle',
    description: 'Anything, across all selected platforms',
    icon: '🎲',
    color: '#8B5CF6'
  },
  {
    id: 'preference',
    name: 'Preference Shuffle',
    description: 'Based on selected genres or viewing history',
    icon: '🎯',
    color: '#10B981'
  },
  {
    id: 'cable',
    name: 'Cable Mode',
    description: 'Autoplay, endless channel-style experience',
    icon: '📺',
    color: '#F59E0B'
  },
  {
    id: 'list',
    name: 'List Shuffle',
    description: 'Shuffle a user-curated pack',
    icon: '📋',
    color: '#EF4444'
  },
  {
    id: 'show',
    name: 'Show Shuffle',
    description: 'Random episode from a show',
    icon: '🎬',
    color: '#3B82F6'
  }
]

export const CULTURAL_THEMES: CulturalTheme[] = [
  {
    id: 'pride',
    name: 'Pride Content',
    description: 'LGBTQ+ themed movies, shows, and celebrations',
    icon: '🏳️‍🌈',
    color: '#FF6B6B',
    preferenceKey: 'show_pride_content'
  },
  {
    id: 'religious',
    name: 'Religious Content',
    description: 'Faith-based and religious holiday content',
    icon: '🙏',
    color: '#4ECDC4',
    preferenceKey: 'show_religious_content'
  },
  {
    id: 'political',
    name: 'Political Content',
    description: 'Political documentaries and commentary',
    icon: '🗳️',
    color: '#45B7D1',
    preferenceKey: 'show_political_content'
  },
  {
    id: 'social_justice',
    name: 'Social Justice',
    description: 'Content focused on social awareness and justice',
    icon: '✊',
    color: '#96CEB4',
    preferenceKey: 'show_social_justice_content'
  }
]

export const BINGER_LEVELS = [
  { level: 'Couch Potato', min: 0, max: 10, reward: 'First Steps Badge' },
  { level: 'Casual Viewer', min: 11, max: 25, reward: 'Viewer Badge' },
  { level: 'Binge Watcher', min: 26, max: 50, reward: 'Binger Badge' },
  { level: 'Stream Master', min: 51, max: 100, reward: 'Master Badge' },
  { level: 'Content Connoisseur', min: 101, max: 200, reward: 'Connoisseur Badge' },
  { level: 'Streaming Legend', min: 201, max: Infinity, reward: 'Legend Status' }
]

export const DEFAULT_USER_PREFERENCES = {
  show_pride_content: true,
  show_religious_content: true,
  show_political_content: true,
  show_social_justice_content: true,
  show_thematic_ui: true
} 