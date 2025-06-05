import type { NextApiRequest, NextApiResponse } from 'next'

interface ShuffleRequest {
  mode: 'full' | 'preference' | 'show' | 'list' | 'platform'
  platforms?: string[]
  genres?: string[]
  contentType?: 'movie' | 'tv' | 'all'
  mood?: string
  listId?: string
  showId?: string
  userId?: string
}

interface ContentItem {
  id: number
  title: string
  type: 'movie' | 'tv'
  platform: string
  genre: string[]
  rating: number
  year: number
  duration: string
  description: string
  poster: string
  deepLink: string
  watchUrl: string
  themed_background?: string
}

interface ShuffleResponse {
  success: boolean
  data?: {
    recommendation: ContentItem
    alternatives: ContentItem[]
    shuffleId: string
    mode: string
  }
  error?: string
}

const PLATFORM_DEEP_LINKS = {
  netflix: 'https://www.netflix.com/title/',
  disney: 'https://www.disneyplus.com/movies/',
  hulu: 'https://www.hulu.com/movie/',
  prime: 'https://www.amazon.com/dp/',
  hbo: 'https://play.hbomax.com/page/',
  apple: 'https://tv.apple.com/movie/',
  paramount: 'https://www.paramountplus.com/movies/',
  peacock: 'https://www.peacocktv.com/watch/asset/'
}

// Generate themed background based on genre and title
const generateThemedBackground = (title: string, genres: string[]): string => {
  const colors = {
    'Action': 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    'Adventure': 'linear-gradient(135deg, #feca57, #ff9ff3)',
    'Animation': 'linear-gradient(135deg, #48dbfb, #0abde3)',
    'Comedy': 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
    'Crime': 'linear-gradient(135deg, #636e72, #2d3436)',
    'Documentary': 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
    'Drama': 'linear-gradient(135deg, #fd79a8, #e84393)',
    'Family': 'linear-gradient(135deg, #55efc4, #00b894)',
    'Fantasy': 'linear-gradient(135deg, #fd79a8, #fdcb6e)',
    'History': 'linear-gradient(135deg, #e17055, #d63031)',
    'Horror': 'linear-gradient(135deg, #2d3436, #636e72)',
    'Music': 'linear-gradient(135deg, #a29bfe, #74b9ff)',
    'Mystery': 'linear-gradient(135deg, #636e72, #2d3436)',
    'Romance': 'linear-gradient(135deg, #fd79a8, #e84393)',
    'Science Fiction': 'linear-gradient(135deg, #74b9ff, #0984e3)',
    'Sci-Fi': 'linear-gradient(135deg, #74b9ff, #0984e3)',
    'TV Movie': 'linear-gradient(135deg, #81ecec, #00cec9)',
    'Thriller': 'linear-gradient(135deg, #2d3436, #636e72)',
    'War': 'linear-gradient(135deg, #636e72, #2d3436)',
    'Western': 'linear-gradient(135deg, #e17055, #d63031)'
  }
  
  const primaryGenre = genres[0] || 'Drama'
  return colors[primaryGenre as keyof typeof colors] || 'linear-gradient(135deg, #667eea, #764ba2)'
}

const MOCK_CONTENT: ContentItem[] = [
  {
    id: 1,
    title: "The Dark Knight",
    type: "movie",
    platform: "hbo",
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    year: 2008,
    duration: "152m",
    description: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}the-dark-knight`,
    watchUrl: "hbomax://movie/the-dark-knight",
    themed_background: generateThemedBackground("The Dark Knight", ["Action", "Crime", "Drama"])
  },
  {
    id: 2,
    title: "Inception",
    type: "movie",
    platform: "netflix",
    genre: ["Action", "Science Fiction", "Thriller"],
    rating: 8.8,
    year: 2010,
    duration: "148m",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.netflix}inception`,
    watchUrl: "netflix://title/inception",
    themed_background: generateThemedBackground("Inception", ["Action", "Science Fiction", "Thriller"])
  },
  {
    id: 3,
    title: "Dune",
    type: "movie",
    platform: "hbo",
    genre: ["Science Fiction", "Adventure", "Drama"],
    rating: 8.0,
    year: 2021,
    duration: "155m",
    description: "Paul Atreides leads nomadic tribes in a revolt against the evil House Harkonnen.",
    poster: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}urn:hbo:feature:GYbX2vQKPDJCCwgEAAABc`,
    watchUrl: "hbomax://feature/urn:hbo:feature:GYbX2vQKPDJCCwgEAAABc",
    themed_background: generateThemedBackground("Dune", ["Science Fiction", "Adventure", "Drama"])
  },
  {
    id: 4,
    title: "Spider-Man: Into the Spider-Verse",
    type: "movie",
    platform: "netflix",
    genre: ["Animation", "Action", "Adventure"],
    rating: 8.4,
    year: 2018,
    duration: "117m",
    description: "Teen Miles Morales becomes Spider-Man and must save the multiverse from collapse.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.netflix}spider-man-into-the-spider-verse`,
    watchUrl: "netflix://title/spider-man-into-the-spider-verse",
    themed_background: generateThemedBackground("Spider-Man: Into the Spider-Verse", ["Animation", "Action", "Adventure"])
  },
  {
    id: 5,
    title: "Top Gun: Maverick",
    type: "movie",
    platform: "paramount",
    genre: ["Action", "Drama"],
    rating: 8.3,
    year: 2022,
    duration: "130m",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
    poster: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.paramount}top-gun-maverick`,
    watchUrl: "paramountplus://content/movies/top-gun-maverick",
    themed_background: generateThemedBackground("Top Gun: Maverick", ["Action", "Drama"])
  },
  {
    id: 6,
    title: "Everything Everywhere All at Once",
    type: "movie",
    platform: "prime",
    genre: ["Action", "Adventure", "Comedy"],
    rating: 8.1,
    year: 2022,
    duration: "139m",
    description: "A Chinese-American woman gets swept up in an insane adventure where she alone can save existence.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.prime}everything-everywhere-all-at-once`,
    watchUrl: "aiv://aiv/resume?asin=everything-everywhere-all-at-once",
    themed_background: generateThemedBackground("Everything Everywhere All at Once", ["Action", "Adventure", "Comedy"])
  },
  {
    id: 7,
    title: "The Batman",
    type: "movie",
    platform: "hbo",
    genre: ["Crime", "Mystery", "Thriller"],
    rating: 7.8,
    year: 2022,
    duration: "176m",
    description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}the-batman`,
    watchUrl: "hbomax://movie/the-batman",
    themed_background: generateThemedBackground("The Batman", ["Crime", "Mystery", "Thriller"])
  },
  {
    id: 8,
    title: "Avatar: The Way of Water",
    type: "movie",
    platform: "disney",
    genre: ["Science Fiction", "Adventure", "Family"],
    rating: 7.6,
    year: 2022,
    duration: "192m",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.disney}avatar-the-way-of-water`,
    watchUrl: "disneyplus://content/movies/avatar-the-way-of-water",
    themed_background: generateThemedBackground("Avatar: The Way of Water", ["Science Fiction", "Adventure", "Family"])
  },
  {
    id: 9,
    title: "Black Panther: Wakanda Forever",
    type: "movie",
    platform: "disney",
    genre: ["Action", "Adventure", "Drama"],
    rating: 7.3,
    year: 2022,
    duration: "161m",
    description: "The people of Wakanda fight to protect their home from intervening world powers.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.disney}black-panther-wakanda-forever`,
    watchUrl: "disneyplus://content/movies/black-panther-wakanda-forever",
    themed_background: generateThemedBackground("Black Panther: Wakanda Forever", ["Action", "Adventure", "Drama"])
  },
  {
    id: 10,
    title: "Glass Onion: A Knives Out Mystery",
    type: "movie",
    platform: "netflix",
    genre: ["Comedy", "Crime", "Mystery"],
    rating: 7.2,
    year: 2022,
    duration: "139m",
    description: "Detective Benoit Blanc travels to Greece to peel back the layers of a mystery involving a new cast of suspects.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.netflix}glass-onion-knives-out-mystery`,
    watchUrl: "netflix://title/glass-onion-knives-out-mystery",
    themed_background: generateThemedBackground("Glass Onion: A Knives Out Mystery", ["Comedy", "Crime", "Mystery"])
  },
  // TV Shows
  {
    id: 11,
    title: "Stranger Things",
    type: "tv",
    platform: "netflix",
    genre: ["Drama", "Mystery", "Sci-Fi"],
    rating: 8.7,
    year: 2016,
    duration: "51m per episode",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
    poster: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.netflix}80057281`,
    watchUrl: "netflix://title/80057281",
    themed_background: generateThemedBackground("Stranger Things", ["Drama", "Mystery", "Sci-Fi"])
  },
  {
    id: 12,
    title: "The Mandalorian",
    type: "tv",
    platform: "disney",
    genre: ["Sci-Fi", "Western", "Drama"],
    rating: 8.7,
    year: 2019,
    duration: "40m per episode",
    description: "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
    poster: "/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.disney}the-mandalorian`,
    watchUrl: "disneyplus://content/series/the-mandalorian",
    themed_background: generateThemedBackground("The Mandalorian", ["Sci-Fi", "Western", "Drama"])
  },
  {
    id: 13,
    title: "The Bear",
    type: "tv",
    platform: "hulu",
    genre: ["Comedy", "Drama"],
    rating: 8.7,
    year: 2022,
    duration: "30m per episode",
    description: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
    poster: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.hulu}the-bear`,
    watchUrl: "hulu://series/the-bear",
    themed_background: generateThemedBackground("The Bear", ["Comedy", "Drama"])
  },
  {
    id: 14,
    title: "Wednesday",
    type: "tv",
    platform: "netflix",
    genre: ["Comedy", "Crime", "Mystery"],
    rating: 8.8,
    year: 2022,
    duration: "45m per episode",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree.",
    poster: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.netflix}wednesday`,
    watchUrl: "netflix://title/wednesday",
    themed_background: generateThemedBackground("Wednesday", ["Comedy", "Crime", "Mystery"])
  },
  {
    id: 15,
    title: "House of the Dragon",
    type: "tv",
    platform: "hbo",
    genre: ["Action", "Drama", "Fantasy"],
    rating: 8.4,
    year: 2022,
    duration: "60m per episode",
    description: "The Targaryen civil war, known as the Dance of the Dragons, tore apart the Seven Kingdoms.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}house-of-the-dragon`,
    watchUrl: "hbomax://series/house-of-the-dragon",
    themed_background: generateThemedBackground("House of the Dragon", ["Action", "Drama", "Fantasy"])
  },
  {
    id: 16,
    title: "The Last of Us",
    type: "tv",
    platform: "hbo",
    genre: ["Drama", "Sci-Fi", "Action"],
    rating: 8.8,
    year: 2023,
    duration: "55m per episode",
    description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}the-last-of-us`,
    watchUrl: "hbomax://series/the-last-of-us",
    themed_background: generateThemedBackground("The Last of Us", ["Drama", "Sci-Fi", "Action"])
  },
  {
    id: 17,
    title: "Abbott Elementary",
    type: "tv",
    platform: "hulu",
    genre: ["Comedy"],
    rating: 8.0,
    year: 2021,
    duration: "22m per episode",
    description: "A workplace mockumentary about the daily lives of teachers in an underfunded Philadelphia elementary school.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hulu}abbott-elementary`,
    watchUrl: "hulu://series/abbott-elementary",
    themed_background: generateThemedBackground("Abbott Elementary", ["Comedy"])
  },
  {
    id: 18,
    title: "The White Lotus",
    type: "tv",
    platform: "hbo",
    genre: ["Comedy", "Drama", "Mystery"],
    rating: 7.9,
    year: 2021,
    duration: "60m per episode",
    description: "Social satire set at an exclusive Hawaiian resort.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}the-white-lotus`,
    watchUrl: "hbomax://series/the-white-lotus",
    themed_background: generateThemedBackground("The White Lotus", ["Comedy", "Drama", "Mystery"])
  },
  {
    id: 19,
    title: "Euphoria",
    type: "tv",
    platform: "hbo",
    genre: ["Drama"],
    rating: 8.4,
    year: 2019,
    duration: "60m per episode",
    description: "A group of high school students navigate love and friendships in a world of drugs, sex, trauma and social media.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}euphoria`,
    watchUrl: "hbomax://series/euphoria",
    themed_background: generateThemedBackground("Euphoria", ["Drama"])
  },
  {
    id: 20,
    title: "Only Murders in the Building",
    type: "tv",
    platform: "hulu",
    genre: ["Comedy", "Crime", "Mystery"],
    rating: 8.1,
    year: 2021,
    duration: "35m per episode",
    description: "Three strangers who share an obsession with true crime podcasts suddenly find themselves wrapped up in one.",
    poster: "",
    deepLink: `${PLATFORM_DEEP_LINKS.hulu}only-murders-in-the-building`,
    watchUrl: "hulu://series/only-murders-in-the-building",
    themed_background: generateThemedBackground("Only Murders in the Building", ["Comedy", "Crime", "Mystery"])
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShuffleResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const shuffleRequest: ShuffleRequest = req.body

    // Filter content based on shuffle parameters
    let filteredContent = [...MOCK_CONTENT]

    // Filter by platforms
    if (shuffleRequest.platforms && shuffleRequest.platforms.length > 0) {
      filteredContent = filteredContent.filter(item => 
        shuffleRequest.platforms!.includes(item.platform)
      )
    }

    // Filter by content type
    if (shuffleRequest.contentType && shuffleRequest.contentType !== 'all') {
      filteredContent = filteredContent.filter(item => 
        item.type === shuffleRequest.contentType
      )
    }

    // Filter by genres
    if (shuffleRequest.genres && shuffleRequest.genres.length > 0) {
      filteredContent = filteredContent.filter(item =>
        item.genre.some(genre => shuffleRequest.genres!.includes(genre))
      )
    }

    // Apply shuffle mode logic
    switch (shuffleRequest.mode) {
      case 'full':
        // No additional filtering - use all available content
        break
      
      case 'preference':
        // Filter by user preferences (mock implementation)
        filteredContent = filteredContent.filter(item => item.rating >= 8.0)
        break
      
      case 'platform':
        // Already filtered by platforms above
        break
      
      case 'show':
        // Filter to specific show episodes (mock implementation)
        if (shuffleRequest.showId) {
          filteredContent = filteredContent.filter(item => 
            item.type === 'tv' && item.id.toString() === shuffleRequest.showId
          )
        } else {
          // If no specific show, filter to TV shows only
          filteredContent = filteredContent.filter(item => item.type === 'tv')
        }
        break
      
      case 'list':
        // Filter to user's custom list (mock implementation)
        filteredContent = filteredContent.filter(item => item.rating >= 8.5)
        break
    }

    if (filteredContent.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No content found matching your criteria'
      })
    }

    // Randomly select a recommendation
    const randomIndex = Math.floor(Math.random() * filteredContent.length)
    const recommendation = filteredContent[randomIndex]

    // Get alternatives (excluding the main recommendation)
    const alternatives = filteredContent
      .filter(item => item.id !== recommendation.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    // Generate shuffle ID for tracking
    const shuffleId = `shuffle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return res.status(200).json({
      success: true,
      data: {
        recommendation,
        alternatives,
        shuffleId,
        mode: shuffleRequest.mode
      }
    })

  } catch (error) {
    console.error('Shuffle generation error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to generate shuffle recommendation'
    })
  }
} 