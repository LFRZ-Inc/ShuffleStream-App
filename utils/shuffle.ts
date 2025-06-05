import { Title, User, UserPreferences, ShuffleModeType } from '@/types'
import { Content, ShufflePreferences, Platform, ContentType } from '@/types'

export interface ShuffleOptions {
  platforms?: string[]
  genres?: string[]
  excludeTags?: string[]
  userId?: string
  packId?: string
  showId?: string
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function filterTitlesByPreferences(
  titles: Title[],
  preferences: UserPreferences | null
): Title[] {
  if (!preferences) return titles

  const hiddenTags: string[] = []
  
  if (!preferences.show_pride_content) hiddenTags.push('pride')
  if (!preferences.show_religious_content) hiddenTags.push('religious')
  if (!preferences.show_political_content) hiddenTags.push('political')
  if (!preferences.show_social_justice_content) hiddenTags.push('social_justice')

  return titles.filter(title => 
    !title.tag || !hiddenTags.includes(title.tag)
  )
}

export function shuffleFullMode(
  titles: Title[],
  options: ShuffleOptions = {}
): Title | null {
  let filteredTitles = [...titles]

  // Filter by platforms if specified
  if (options.platforms?.length) {
    filteredTitles = filteredTitles.filter(title =>
      options.platforms!.includes(title.platform)
    )
  }

  // Filter by excluded tags
  if (options.excludeTags?.length) {
    filteredTitles = filteredTitles.filter(title =>
      !title.tag || !options.excludeTags!.includes(title.tag)
    )
  }

  if (filteredTitles.length === 0) return null

  const shuffled = shuffleArray(filteredTitles)
  return shuffled[0]
}

export function shuffleByPreferences(
  titles: Title[],
  user: User,
  options: ShuffleOptions = {}
): Title | null {
  let filteredTitles = [...titles]

  // Filter by user's preferred platforms
  if (user.platforms?.length) {
    filteredTitles = filteredTitles.filter(title =>
      user.platforms.includes(title.platform)
    )
  }

  // Filter by user's preferred genres
  if (user.genres?.length) {
    filteredTitles = filteredTitles.filter(title =>
      title.genre.some(g => user.genres.includes(g))
    )
  }

  // Apply additional filters
  if (options.excludeTags?.length) {
    filteredTitles = filteredTitles.filter(title =>
      !title.tag || !options.excludeTags!.includes(title.tag)
    )
  }

  if (filteredTitles.length === 0) return null

  const shuffled = shuffleArray(filteredTitles)
  return shuffled[0]
}

export function shuffleFromPack(
  titles: Title[],
  packTitleIds: string[]
): Title | null {
  const packTitles = titles.filter(title =>
    packTitleIds.includes(title.id)
  )

  if (packTitles.length === 0) return null

  const shuffled = shuffleArray(packTitles)
  return shuffled[0]
}

export function shuffleFromShow(
  titles: Title[],
  showName: string
): Title | null {
  const showEpisodes = titles.filter(title =>
    title.name.toLowerCase().includes(showName.toLowerCase()) &&
    title.type === 'tv'
  )

  if (showEpisodes.length === 0) return null

  const shuffled = shuffleArray(showEpisodes)
  return shuffled[0]
}

export function getShuffleRecommendation(
  mode: ShuffleModeType,
  titles: Title[],
  user: User | null,
  preferences: UserPreferences | null,
  options: ShuffleOptions = {}
): { title: Title | null; reason: string; confidence: number } {
  // Filter titles by user preferences first
  const filteredTitles = preferences 
    ? filterTitlesByPreferences(titles, preferences)
    : titles

  let title: Title | null = null
  let reason = ''
  let confidence = 0

  switch (mode) {
    case 'full':
      title = shuffleFullMode(filteredTitles, options)
      reason = 'Random selection from all available content'
      confidence = 0.7
      break

    case 'preference':
      if (user) {
        title = shuffleByPreferences(filteredTitles, user, options)
        reason = 'Based on your preferred genres and platforms'
        confidence = 0.9
      } else {
        title = shuffleFullMode(filteredTitles, options)
        reason = 'Random selection (no preferences available)'
        confidence = 0.5
      }
      break

    case 'list':
      if (options.packId) {
        // This would need to fetch pack data from the database
        reason = 'From your curated list'
        confidence = 0.8
      }
      break

    case 'show':
      if (options.showId) {
        title = shuffleFromShow(filteredTitles, options.showId)
        reason = 'Random episode from the selected show'
        confidence = 0.8
      }
      break

    case 'cable':
      title = shuffleFullMode(filteredTitles, options)
      reason = 'Cable-style random selection'
      confidence = 0.6
      break

    default:
      title = shuffleFullMode(filteredTitles, options)
      reason = 'Default random selection'
      confidence = 0.5
  }

  return { title, reason, confidence }
}

// Filter content based on preferences
function filterByPreferences(content: Content[], preferences: ShufflePreferences): Content[] {
  return content.filter(item => {
    // Check content type
    if (item.type && !preferences.contentTypes.includes(item.type)) return false
    
    // Check platform
    if (item.platformId && preferences.excludedPlatforms.includes(item.platformId)) return false
    
    // Check genre overlap
    if (preferences.genres.length > 0 && item.genres && 
        !item.genres.some(g => preferences.genres.includes(g.id))) return false
    
    // Check rating (assuming rating is 1-10)
    const numericRating = typeof item.rating === 'string' ? parseFloat(item.rating) : item.rating
    if (!isNaN(numericRating) && numericRating < preferences.minRating) return false
    
    // Check duration
    if (preferences.maxDuration > 0 && item.duration && item.duration > preferences.maxDuration) return false
    
    return true
  })
}

// Get random episode from a series
function getRandomEpisode(content: Content[], seriesId: string): Content | null {
  const episodes = content.filter(
    item => item.type === 'episode' && item.seriesId === seriesId
  )
  if (episodes.length === 0) return null
  return episodes[Math.floor(Math.random() * episodes.length)]
}

// Full Shuffle - Anything across all platforms
export function fullShuffle(content: Content[], count: number = 10): Content[] {
  return shuffleArray(content).slice(0, count)
}

// Preference Shuffle - Based on user preferences
export function preferenceShuffle(
  content: Content[],
  preferences: ShufflePreferences,
  count: number = 10
): Content[] {
  const filtered = filterByPreferences(content, preferences)
  return shuffleArray(filtered).slice(0, count)
}

// Cable Mode - Endless autoplay with smart transitions
export function cableModeShuffle(
  content: Content[],
  preferences: ShufflePreferences,
  currentGenre?: string | undefined
): Content[] {
  let filtered = filterByPreferences(content, preferences)
  
  // If we have a current genre, prioritize similar content
  if (currentGenre) {
    const similar = filtered.filter(item => 
      item.genres?.some(g => g.id === currentGenre)
    )
    if (similar.length > 0) {
      filtered = [...similar, ...filtered.filter(item => 
        !item.genres?.some(g => g.id === currentGenre)
      )]
    }
  }
  
  return shuffleArray(filtered).slice(0, 10)
}

// List Shuffle - From user's curated list
export function listShuffle(content: Content[], listIds: string[], count: number = 10): Content[] {
  const listContent = content.filter(item => listIds.includes(item.id))
  return shuffleArray(listContent).slice(0, count)
}

// Show Shuffle - Random episode from selected show
export function showShuffle(content: Content[], seriesId: string, count: number = 10): Content[] {
  const episodes: Content[] = []
  
  while (episodes.length < count) {
    const episode = getRandomEpisode(content, seriesId)
    if (!episode) break
    if (!episodes.some(e => e.id === episode.id)) {
      episodes.push(episode)
    }
  }
  
  return episodes
}

// Main shuffle function that handles all modes
export function shuffle(
  mode: ShuffleModeType,
  content: Content[],
  options: {
    preferences?: ShufflePreferences,
    listIds?: string[],
    seriesId?: string,
    currentGenre?: string | undefined,
    count?: number
  } = {}
): Content[] {
  const { preferences, listIds, seriesId, currentGenre, count = 10 } = options
  
  switch (mode) {
    case 'full':
      return fullShuffle(content, count)
      
    case 'preference':
      return preferences 
        ? preferenceShuffle(content, preferences, count)
        : fullShuffle(content, count)
      
    case 'cable':
      return preferences
        ? cableModeShuffle(content, preferences, currentGenre)
        : fullShuffle(content, count)
      
    case 'list':
      return listIds
        ? listShuffle(content, listIds, count)
        : fullShuffle(content, count)
      
    case 'show':
      return seriesId
        ? showShuffle(content, seriesId, count)
        : fullShuffle(content, count)
      
    default:
      return fullShuffle(content, count)
  }
} 