import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { searchParams } = new URL(request.url)
    
    // Get user from session - for now using a placeholder
    // In production, implement proper auth header validation
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const packId = searchParams.get('packId')
    const excludeWatched = searchParams.get('excludeWatched') === 'true'

    if (!packId) {
      return NextResponse.json({ error: 'Pack ID is required' }, { status: 400 })
    }

    // Get the shuffle pack
    const { data: shufflePack, error: packError } = await supabase
      .from('shuffle_packs')
      .select('*')
      .eq('id', packId)
      .or(`user_id.eq.${userId},is_public.eq.true`)
      .single()

    if (packError || !shufflePack) {
      return NextResponse.json({ error: 'Shuffle pack not found' }, { status: 404 })
    }

    if (!shufflePack.title_ids || shufflePack.title_ids.length === 0) {
      return NextResponse.json({ error: 'Shuffle pack is empty' }, { status: 404 })
    }

    // Get watched titles to exclude if requested
    let watchedTitleIds: string[] = []
    if (excludeWatched) {
      const { data: watchedTitles } = await supabase
        .from('watched_titles')
        .select('title_id')
        .eq('user_id', userId)
      
      watchedTitleIds = watchedTitles?.map((w: any) => w.title_id) || []
    }

    // Filter out watched titles from the pack
    let availableTitleIds = shufflePack.title_ids
    if (watchedTitleIds.length > 0) {
      availableTitleIds = shufflePack.title_ids.filter((id: string) => !watchedTitleIds.includes(id))
    }

    if (availableTitleIds.length === 0) {
      return NextResponse.json({ 
        error: 'No unwatched titles in pack',
        message: 'All titles in this pack have been watched'
      }, { status: 404 })
    }

    // Randomly select a title ID
    const randomIndex = Math.floor(Math.random() * availableTitleIds.length)
    const selectedTitleId = availableTitleIds[randomIndex]

    // Get the full title information with platform data
    const { data: titleData, error: titleError } = await supabase
      .from('titles')
      .select(`
        *,
        title_platforms(platform_id, deep_link_url)
      `)
      .eq('id', selectedTitleId)
      .single()

    if (titleError || !titleData) {
      return NextResponse.json({ error: 'Title not found' }, { status: 404 })
    }

    // Get user's available platforms to suggest the best viewing option
    const { data: userPlatforms } = await supabase
      .from('user_platforms')
      .select('platform_id')
      .eq('user_id', userId)
      .eq('is_active', true)

    const availablePlatforms = userPlatforms?.map((p: any) => p.platform_id) || []

    // Find the best platform match
    const platformOptions = titleData.title_platforms || []
    const bestPlatform = platformOptions.find((p: any) => availablePlatforms.includes(p.platform_id)) 
                        || platformOptions[0]

    // Format response
    const response = {
      id: titleData.id,
      title: titleData.title,
      type: titleData.type,
      releaseYear: titleData.release_year,
      runtime: titleData.runtime_minutes,
      poster: titleData.poster_url,
      backdrop: titleData.backdrop_url,
      description: titleData.description,
      genres: titleData.genres,
      rating: titleData.imdb_rating,
      platform: bestPlatform ? {
        id: bestPlatform.platform_id,
        deepLink: bestPlatform.deep_link_url
      } : null,
      tmdbId: titleData.tmdb_id,
      packInfo: {
        id: shufflePack.id,
        name: shufflePack.name,
        description: shufflePack.description,
        remainingTitles: availableTitleIds.length - 1
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('List shuffle API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Create new shuffle pack
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { name, description, titleIds, isPublic, userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    if (!name || !titleIds || titleIds.length === 0) {
      return NextResponse.json({ 
        error: 'Name and title IDs are required' 
      }, { status: 400 })
    }

    // Create new shuffle pack
    const { data: newPack, error: packError } = await supabase
      .from('shuffle_packs')
      .insert({
        user_id: userId,
        name,
        description: description || '',
        title_ids: titleIds,
        is_public: isPublic || false
      })
      .select()
      .single()

    if (packError) {
      console.error('Error creating shuffle pack:', packError)
      return NextResponse.json({ error: 'Failed to create shuffle pack' }, { status: 500 })
    }

    return NextResponse.json(newPack)

  } catch (error) {
    console.error('Create pack error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 