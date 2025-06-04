export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          is_pro: boolean
          platforms: string[]
          genres: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          is_pro?: boolean
          platforms?: string[]
          genres?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          is_pro?: boolean
          platforms?: string[]
          genres?: string[]
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          show_pride_content: boolean
          show_religious_content: boolean
          show_political_content: boolean
          show_social_justice_content: boolean
          show_thematic_ui: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          show_pride_content?: boolean
          show_religious_content?: boolean
          show_political_content?: boolean
          show_social_justice_content?: boolean
          show_thematic_ui?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          show_pride_content?: boolean
          show_religious_content?: boolean
          show_political_content?: boolean
          show_social_justice_content?: boolean
          show_thematic_ui?: boolean
          updated_at?: string
        }
      }
      titles: {
        Row: {
          id: string
          name: string
          platform: string
          genre: string[]
          deep_link_url: string
          image_url: string | null
          description: string | null
          tag: string | null
          is_hosted: boolean
          type: 'movie' | 'tv' | 'music'
          rating: number | null
          release_year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          platform: string
          genre: string[]
          deep_link_url: string
          image_url?: string | null
          description?: string | null
          tag?: string | null
          is_hosted?: boolean
          type: 'movie' | 'tv' | 'music'
          rating?: number | null
          release_year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          platform?: string
          genre?: string[]
          deep_link_url?: string
          image_url?: string | null
          description?: string | null
          tag?: string | null
          is_hosted?: boolean
          type?: 'movie' | 'tv' | 'music'
          rating?: number | null
          release_year?: number | null
          updated_at?: string
        }
      }
      watched_titles: {
        Row: {
          id: string
          user_id: string
          title_id: string
          watched_at: string
          rating: number | null
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title_id: string
          watched_at?: string
          rating?: number | null
          completed?: boolean
        }
        Update: {
          rating?: number | null
          completed?: boolean
        }
      }
      shuffle_packs: {
        Row: {
          id: string
          user_id: string
          name: string
          title_ids: string[]
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          title_ids: string[]
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          title_ids?: string[]
          is_public?: boolean
          updated_at?: string
        }
      }
      leaderboard: {
        Row: {
          id: string
          user_id: string
          month: string
          titles_watched_count: number
          rank: number
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          titles_watched_count: number
          rank: number
          points: number
          created_at?: string
        }
        Update: {
          titles_watched_count?: number
          rank?: number
          points?: number
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          month: string
          favorite_title_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          favorite_title_id: string
          created_at?: string
        }
        Update: {
          favorite_title_id?: string
        }
      }
      recap_data: {
        Row: {
          id: string
          user_id: string
          period: string
          total_titles: number
          top_genres: string[]
          favorite_title_id: string | null
          recap_image_url: string | null
          stats: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period: string
          total_titles: number
          top_genres: string[]
          favorite_title_id?: string | null
          recap_image_url?: string | null
          stats?: Record<string, any>
          created_at?: string
        }
        Update: {
          total_titles?: number
          top_genres?: string[]
          favorite_title_id?: string | null
          recap_image_url?: string | null
          stats?: Record<string, any>
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 