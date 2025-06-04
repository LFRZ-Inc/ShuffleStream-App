import { Title, User, UserPreferences, ShuffleModeType } from '@/types'

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