import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { searchParams } = new URL(request.url)
    
    // Get user ID from query params - in production implement proper auth
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }
    const platforms = searchParams.get('platforms')?.split(',') || []
    const excludeWatched = searchParams.get('excludeWatched') === 'true'

    // Get user preferences for cultural content filtering
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get user's available platforms
    const { data: userPlatforms } = await supabase
      .from('user_platforms')
      .select('platform_id')
      .eq('user_id', userId)
      .eq('is_active', true)

    const availablePlatforms = userPlatforms?.map(p => p.platform_id) || []
    const targetPlatforms = platforms.length > 0 ? platforms : availablePlatforms

    // Build cultural content filter
    let culturalFilter = []
    if (!preferences?.show_pride_content) culturalFilter.push('pride')
    if (!preferences?.show_religious_content) culturalFilter.push('religious')
    if (!preferences?.show_political_content) culturalFilter.push('political')
    if (!preferences?.show_social_justice_content) culturalFilter.push('social_justice')

    // Get watched titles to exclude if requested
    let watchedTitleIds: string[] = []
    if (excludeWatched) {
      const { data: watchedTitles } = await supabase
        .from('watched_titles')
        .select('title_id')
        .eq('user_id', userId)
      
      watchedTitleIds = watchedTitles?.map(w => w.title_id) || []
    }

    // Build the query for available titles
    let query = supabase
      .from('titles')
      .select(`
        *,
        title_platforms!inner(platform_id, deep_link_url)
      `)

    // Filter by available platforms
    if (targetPlatforms.length > 0) {
      query = query.in('title_platforms.platform_id', targetPlatforms)
    }

    // Exclude watched titles
    if (watchedTitleIds.length > 0) {
      query = query.not('id', 'in', `(${watchedTitleIds.join(',')})`)
    }

    // Filter out cultural content based on preferences
    if (culturalFilter.length > 0) {
      // PostgreSQL: not overlapping with cultural_tags array
      query = query.not('cultural_tags', 'ov', culturalFilter)
    }

    const { data: availableTitles, error: titlesError } = await query.limit(100)

    if (titlesError) {
      console.error('Error fetching titles:', titlesError)
      return NextResponse.json({ error: 'Failed to fetch titles' }, { status: 500 })
    }

    if (!availableTitles || availableTitles.length === 0) {
      return NextResponse.json({ 
        error: 'No titles available',
        message: 'Try adjusting your platform selection or cultural preferences'
      }, { status: 404 })
    }

    // Randomly select a title
    const randomIndex = Math.floor(Math.random() * availableTitles.length)
    const selectedTitle = availableTitles[randomIndex]

    // Get the platform info for deep linking
    const platformInfo = Array.isArray(selectedTitle.title_platforms) 
      ? selectedTitle.title_platforms[0] 
      : selectedTitle.title_platforms

    // Format response
    const response = {
      id: selectedTitle.id,
      title: selectedTitle.title,
      type: selectedTitle.type,
      releaseYear: selectedTitle.release_year,
      runtime: selectedTitle.runtime_minutes,
      poster: selectedTitle.poster_url,
      backdrop: selectedTitle.backdrop_url,
      description: selectedTitle.description,
      genres: selectedTitle.genres,
      rating: selectedTitle.imdb_rating,
      platform: {
        id: platformInfo.platform_id,
        deepLink: platformInfo.deep_link_url
      },
      tmdbId: selectedTitle.tmdb_id
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Shuffle API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { titleId, userId, rating, watchDuration } = await request.json()

    // Record the watch session
    const { error } = await supabase
      .from('watched_titles')
      .insert({
        user_id: userId,
        title_id: titleId,
        rating,
        watch_duration_minutes: watchDuration,
        completed: watchDuration > 0,
        watched_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error recording watch:', error)
      return NextResponse.json({ error: 'Failed to record watch' }, { status: 500 })
    }

    // Update user's monthly stats
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const { error: leaderboardError } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: userId,
        month: currentMonth,
        year: currentYear,
        titles_watched: 1,
        total_watch_time_minutes: watchDuration || 0
      }, {
        onConflict: 'user_id,month,year',
        ignoreDuplicates: false
      })

    if (leaderboardError) {
      console.error('Error updating leaderboard:', leaderboardError)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Watch recording error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 