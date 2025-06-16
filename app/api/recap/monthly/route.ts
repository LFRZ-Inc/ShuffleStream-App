import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { searchParams } = new URL(request.url)
    
    const userId = searchParams.get('userId')
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    // Get date range for the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Get user's watched titles for the month with title details
    const { data: watchedTitles, error: watchedError } = await supabase
      .from('watched_titles')
      .select(`
        *,
        titles!inner(title, type, genres, poster_url)
      `)
      .eq('user_id', userId)
      .gte('watched_at', startDate.toISOString())
      .lte('watched_at', endDate.toISOString())

    if (watchedError) {
      console.error('Error fetching watched titles:', watchedError)
      return NextResponse.json({ error: 'Failed to fetch viewing data' }, { status: 500 })
    }

    if (!watchedTitles || watchedTitles.length === 0) {
      return NextResponse.json({
        message: 'No viewing activity found for this month',
        month,
        year,
        recap: null
      })
    }

    // Calculate statistics
    const totalTitles = watchedTitles.length
    const totalWatchTime = watchedTitles.reduce((sum: number, watch: any) => 
      sum + (watch.watch_duration_minutes || 0), 0)

    // Find favorite title (highest rated or most recently watched)
    const favoriteTitle = watchedTitles
      .filter((watch: any) => watch.rating)
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))[0] ||
      watchedTitles[watchedTitles.length - 1]

    // Calculate genre breakdown
    const genreCount: { [key: string]: number } = {}
    watchedTitles.forEach((watch: any) => {
      const genres = watch.titles.genres || []
      genres.forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    })

    const topGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre, count]) => ({ genre, count }))

    // Calculate content type breakdown
    const typeCount: { [key: string]: number } = {}
    watchedTitles.forEach((watch: any) => {
      const type = watch.titles.type || 'unknown'
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    // Get user's ranking for the month
    const { data: leaderboardData } = await supabase
      .from('leaderboard')
      .select('rank_position, titles_watched')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .single()

    // Compare to previous month
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    
    const { data: previousMonthData } = await supabase
      .from('leaderboard')
      .select('titles_watched, total_watch_time_minutes')
      .eq('user_id', userId)
      .eq('month', prevMonth)
      .eq('year', prevYear)
      .single()

    // Calculate improvements
    const improvementStats = {
      titlesWatchedChange: totalTitles - (previousMonthData?.titles_watched || 0),
      watchTimeChange: totalWatchTime - (previousMonthData?.total_watch_time_minutes || 0)
    }

    // Determine binger level
    const bingerLevel = getBingerLevel(totalTitles)

    // Generate insights
    const insights = generateInsights(watchedTitles, topGenres, totalWatchTime, improvementStats)

    const recap = {
      month,
      year,
      period: `${getMonthName(month)} ${year}`,
      statistics: {
        totalTitles,
        totalWatchTime,
        totalWatchTimeFormatted: formatWatchTime(totalWatchTime),
        averageWatchTime: Math.round(totalWatchTime / totalTitles),
        bingerLevel,
        currentRank: leaderboardData?.rank_position || null
      },
      favorites: {
        title: favoriteTitle?.titles?.title || 'N/A',
        poster: favoriteTitle?.titles?.poster_url || null,
        rating: favoriteTitle?.rating || null
      },
      breakdown: {
        topGenres,
        contentTypes: Object.entries(typeCount).map(([type, count]) => ({ type, count }))
      },
      comparison: {
        previousMonth: `${getMonthName(prevMonth)} ${prevYear}`,
        improvements: improvementStats
      },
      insights,
      achievements: generateAchievements(totalTitles, topGenres, bingerLevel)
    }

    return NextResponse.json({ recap })

  } catch (error) {
    console.error('Monthly recap API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Create a new recap entry
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { userId, month, year } = await request.json()
    
    if (!userId || !month || !year) {
      return NextResponse.json({ 
        error: 'User ID, month, and year are required' 
      }, { status: 400 })
    }

    // Check if recap already exists
    const { data: existingRecap } = await supabase
      .from('recap_data')
      .select('id')
      .eq('user_id', userId)
      .eq('period_type', 'monthly')
      .eq('period_start', new Date(year, month - 1, 1).toISOString().split('T')[0])
      .single()

    if (existingRecap) {
      return NextResponse.json({ 
        error: 'Recap for this month already exists' 
      }, { status: 409 })
    }

    // Generate recap data (similar to GET logic but simplified)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const { data: watchedTitles } = await supabase
      .from('watched_titles')
      .select(`
        *,
        titles!inner(title, genres)
      `)
      .eq('user_id', userId)
      .gte('watched_at', startDate.toISOString())
      .lte('watched_at', endDate.toISOString())

    const totalTitles = watchedTitles?.length || 0
    const totalWatchTime = watchedTitles?.reduce((sum: number, watch: any) => 
      sum + (watch.watch_duration_minutes || 0), 0) || 0

    // Find most watched genre
    const genreCount: { [key: string]: number } = {}
    watchedTitles?.forEach((watch: any) => {
      const genres = watch.titles.genres || []
      genres.forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    })

    const topGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre)

    // Save recap data
    const { data: recap, error } = await supabase
      .from('recap_data')
      .insert({
        user_id: userId,
        period_type: 'monthly',
        period_start: startDate.toISOString().split('T')[0],
        period_end: endDate.toISOString().split('T')[0],
        total_titles_watched: totalTitles,
        total_watch_time_minutes: totalWatchTime,
        top_genres: topGenres,
        binger_level: getBingerLevel(totalTitles)
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating recap:', error)
      return NextResponse.json({ error: 'Failed to create recap' }, { status: 500 })
    }

    return NextResponse.json({ recap })

  } catch (error) {
    console.error('Create recap error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Helper functions
function getBingerLevel(titlesWatched: number): string {
  if (titlesWatched >= 201) return 'Streaming Legend'
  if (titlesWatched >= 101) return 'Content Connoisseur' 
  if (titlesWatched >= 51) return 'Stream Master'
  if (titlesWatched >= 26) return 'Binge Watcher'
  if (titlesWatched >= 11) return 'Casual Viewer'
  return 'Couch Potato'
}

function formatWatchTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month - 1] || 'Unknown'
}

function generateInsights(watchedTitles: any[], topGenres: any[], totalWatchTime: number, improvements: any): string[] {
  const insights = []
  
  if (topGenres.length > 0) {
    insights.push(`You're really into ${topGenres[0].genre} this month!`)
  }
  
  if (totalWatchTime > 1440) { // More than 24 hours
    insights.push('You spent more than a full day watching content!')
  }
  
  if (improvements.titlesWatchedChange > 5) {
    insights.push(`You watched ${improvements.titlesWatchedChange} more titles than last month!`)
  }
  
  if (watchedTitles.length > 30) {
    insights.push('You averaged more than one title per day - impressive!')
  }
  
  return insights.length > 0 ? insights : ['Keep watching to unlock more insights!']
}

function generateAchievements(totalTitles: number, topGenres: any[], bingerLevel: string): string[] {
  const achievements = []
  
  if (totalTitles >= 10) achievements.push('Monthly Milestone')
  if (totalTitles >= 25) achievements.push('Binge Master')
  if (totalTitles >= 50) achievements.push('Content Consumer')
  if (topGenres.length >= 3) achievements.push('Genre Explorer')
  
  return achievements
} 