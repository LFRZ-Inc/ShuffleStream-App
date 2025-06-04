import { useState, useEffect } from 'react'
import { CulturalPreferences } from '@/types'
import { supabase } from '@/lib/supabase'

export function useCulturalThemes(userId: string) {
  const [preferences, setPreferences] = useState<CulturalPreferences>({
    userId,
    culturalThemes: {
      pride: false,
      religious: false,
      political: false,
      socialJustice: false
    },
    thematicUI: false,
    updatedAt: new Date()
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Load preferences from database
  useEffect(() => {
    async function loadPreferences() {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single()
          
        if (error) throw error
        
        if (data) {
          setPreferences({
            userId,
            culturalThemes: {
              pride: data.show_pride_content,
              religious: data.show_religious_content,
              political: data.show_political_content,
              socialJustice: data.show_social_justice_content
            },
            thematicUI: data.show_thematic_ui,
            updatedAt: new Date(data.updated_at)
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load preferences'))
      } finally {
        setLoading(false)
      }
    }
    
    loadPreferences()
  }, [userId])
  
  // Update a specific theme preference
  const updateTheme = async (
    theme: keyof CulturalPreferences['culturalThemes'],
    enabled: boolean
  ) => {
    try {
      const updates = {
        [`show_${theme}_content`]: enabled,
        updated_at: new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...updates
        })
        
      if (error) throw error
      
      setPreferences(prev => ({
        ...prev,
        culturalThemes: {
          ...prev.culturalThemes,
          [theme]: enabled
        },
        updatedAt: new Date()
      }))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update theme'))
      throw err
    }
  }
  
  // Toggle thematic UI
  const toggleThematicUI = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          show_thematic_ui: enabled,
          updated_at: new Date().toISOString()
        })
        
      if (error) throw error
      
      setPreferences(prev => ({
        ...prev,
        thematicUI: enabled,
        updatedAt: new Date()
      }))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to toggle thematic UI'))
      throw err
    }
  }
  
  // Get current theme based on date and preferences
  const getCurrentTheme = () => {
    const now = new Date()
    const month = now.getMonth()
    
    // Pride Month (June)
    if (month === 5 && preferences.culturalThemes.pride) {
      return 'pride'
    }
    
    // Religious holidays
    if (preferences.culturalThemes.religious) {
      // Add logic for detecting religious holidays
      // This would need a more comprehensive holiday calendar
    }
    
    // Social justice awareness months
    if (preferences.culturalThemes.socialJustice) {
      // Add logic for various awareness months
      // This would need a comprehensive calendar of awareness months
    }
    
    return 'default'
  }
  
  return {
    preferences,
    loading,
    error,
    updateTheme,
    toggleThematicUI,
    getCurrentTheme
  }
} 