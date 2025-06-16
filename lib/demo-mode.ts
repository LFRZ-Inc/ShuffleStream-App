// Demo mode for GitHub Pages deployment
export const isDemoMode = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('github.io') || 
         process.env.NODE_ENV === 'production' && 
         window.location.pathname.includes('/ShuffleStream-App');
};

// Mock data for demo mode
export const mockShuffleResult = {
  success: true,
  content: {
    id: 'demo-1',
    title: 'Stranger Things',
    type: 'series',
    year: 2016,
    genre: ['Drama', 'Fantasy', 'Horror'],
    rating: 8.7,
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    platforms: [
      {
        name: 'Netflix',
        link: 'https://netflix.com/title/80057281',
        available: true
      }
    ],
    culturalTags: [],
    watchTime: 51,
    seasons: 4
  },
  mode: 'mood',
  preferences: {
    genres: ['Drama', 'Sci-Fi'],
    excludeCultural: [],
    platforms: ['netflix', 'hulu', 'disney+']
  }
};

export const mockLeaderboard = {
  success: true,
  data: {
    monthly: [
      { rank: 1, username: 'StreamMaster2024', points: 2500, level: 'Content Connoisseur' },
      { rank: 2, username: 'BingeWatcher', points: 1800, level: 'Stream Master' },
      { rank: 3, username: 'CouchPotato', points: 1200, level: 'Binge Watcher' },
      { rank: 4, username: 'YouDemoUser', points: 450, level: 'Casual Viewer' },
      { rank: 5, username: 'SeriesSeeker', points: 380, level: 'Casual Viewer' }
    ],
    userRank: 4,
    userPoints: 450
  }
};

export const mockRecap = {
  success: true,
  data: {
    month: 'November 2024',
    totalWatchTime: 2340, // minutes
    contentWatched: 18,
    topGenres: [
      { genre: 'Drama', count: 6, percentage: 33 },
      { genre: 'Action', count: 4, percentage: 22 },
      { genre: 'Comedy', count: 3, percentage: 17 }
    ],
    topPlatforms: [
      { platform: 'Netflix', count: 8, percentage: 44 },
      { platform: 'Disney+', count: 4, percentage: 22 },
      { platform: 'Hulu', count: 3, percentage: 17 }
    ],
    achievements: [
      'Binge Master: Watched 5+ episodes in one session',
      'Genre Explorer: Tried 3 new genres this month'
    ],
    insights: [
      'You watched 32% more content than last month!',
      'Drama is your most-watched genre this month',
      'You discovered 4 new shows you rated highly'
    ],
    level: 'Casual Viewer',
    pointsEarned: 180,
    nextLevel: 'Binge Watcher',
    pointsToNext: 50
  }
}; 