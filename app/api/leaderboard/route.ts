import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { searchParams } = new URL(request.url)
    
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get leaderboard data for the specified month/year
    const { data: leaderboardData, error } = await supabase
      .from('leaderboard')
      .select(`
        *,
        users!inner(display_name, avatar_url)
      `)
      .eq('month', month)
      .eq('year', year)
      .order('titles_watched', { ascending: false })
      .order('total_watch_time_minutes', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }

    // Format the response
    const formattedLeaderboard = leaderboardData?.map((entry: any, index: number) => ({
      rank: index + 1,
      userId: entry.user_id,
      displayName: entry.users.display_name,
      avatar: entry.users.avatar_url,
      titlesWatched: entry.titles_watched,
      totalWatchTime: entry.total_watch_time_minutes,
      favoriteGenre: entry.favorite_genre,
      // Calculate level based on titles watched
      level: getBingerLevel(entry.titles_watched),
      // Calculate watch time in human readable format
      watchTimeFormatted: formatWatchTime(entry.total_watch_time_minutes)
    })) || []

    return NextResponse.json({
      month,
      year,
      leaderboard: formattedLeaderboard,
      total: formattedLeaderboard.length
    })

  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Update user's leaderboard stats
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { userId, watchDuration, genre } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    // Get current stats
    const { data: currentStats } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single()

    // Increment counters
    const newTitlesWatched = (currentStats?.titles_watched || 0) + 1
    const newWatchTime = (currentStats?.total_watch_time_minutes || 0) + (watchDuration || 0)

    // Update or insert leaderboard entry
    const { error } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: userId,
        month: currentMonth,
        year: currentYear,
        titles_watched: newTitlesWatched,
        total_watch_time_minutes: newWatchTime,
        favorite_genre: genre || currentStats?.favorite_genre || null
      }, {
        onConflict: 'user_id,month,year'
      })

    if (error) {
      console.error('Error updating leaderboard:', error)
      return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 })
    }

    // Recalculate rankings for all users this month
    await updateRankings(supabase, currentMonth, currentYear)

    return NextResponse.json({ 
      success: true,
      newStats: {
        titlesWatched: newTitlesWatched,
        totalWatchTime: newWatchTime,
        level: getBingerLevel(newTitlesWatched)
      }
    })

  } catch (error) {
    console.error('Update leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Helper function to determine binger level
function getBingerLevel(titlesWatched: number): string {
  if (titlesWatched >= 201) return 'Streaming Legend'
  if (titlesWatched >= 101) return 'Content Connoisseur' 
  if (titlesWatched >= 51) return 'Stream Master'
  if (titlesWatched >= 26) return 'Binge Watcher'
  if (titlesWatched >= 11) return 'Casual Viewer'
  return 'Couch Potato'
}

// Helper function to format watch time
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

// Helper function to update rankings
async function updateRankings(supabase: any, month: number, year: number) {
  try {
    // Get all users for the month sorted by titles watched (desc) then watch time (desc)
    const { data: users } = await supabase
      .from('leaderboard')
      .select('user_id, titles_watched, total_watch_time_minutes')
      .eq('month', month)
      .eq('year', year)
      .order('titles_watched', { ascending: false })
      .order('total_watch_time_minutes', { ascending: false })

    if (!users) return

    // Update rankings
    const updates = users.map((user: any, index: number) => ({
      user_id: user.user_id,
      month,
      year,
      rank_position: index + 1,
      titles_watched: user.titles_watched,
      total_watch_time_minutes: user.total_watch_time_minutes
    }))

    // Batch update rankings
    const { error } = await supabase
      .from('leaderboard')
      .upsert(updates, {
        onConflict: 'user_id,month,year'
      })

    if (error) {
      console.error('Error updating rankings:', error)
    }
  } catch (error) {
    console.error('Error in updateRankings:', error)
  }
} 