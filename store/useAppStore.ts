import { create } from 'zustand'
import { User, UserPreferences, Title, BingerChallenge } from '@/types'

interface AppState {
  user: User | null
  preferences: UserPreferences | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  titles: Title[]
  currentShuffle: Title | null
  shuffleHistory: Title[]
  watchedToday: number
  bingerChallenge: BingerChallenge | null
  sidebarOpen: boolean
  currentTheme: 'light' | 'dark'
  
  setUser: (user: User | null) => void
  setPreferences: (preferences: UserPreferences | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTitles: (titles: Title[]) => void
  setCurrentShuffle: (title: Title | null) => void
  addToShuffleHistory: (title: Title) => void
  incrementWatchedToday: () => void
  setBingerChallenge: (challenge: BingerChallenge | null) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  preferences: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  titles: [],
  currentShuffle: null,
  shuffleHistory: [],
  watchedToday: 0,
  bingerChallenge: null,
  sidebarOpen: false,
  currentTheme: 'light',

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),

  setPreferences: (preferences) => set({ preferences }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setTitles: (titles) => set({ titles }),
  setCurrentShuffle: (currentShuffle) => set({ currentShuffle }),

  addToShuffleHistory: (title) => set((state) => ({
    shuffleHistory: [title, ...state.shuffleHistory.slice(0, 9)]
  })),

  incrementWatchedToday: () => set((state) => ({
    watchedToday: state.watchedToday + 1
  })),

  setBingerChallenge: (bingerChallenge) => set({ bingerChallenge }),

  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),

  setTheme: (currentTheme) => set({ currentTheme }),

  reset: () => set({
    user: null,
    preferences: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    titles: [],
    currentShuffle: null,
    shuffleHistory: [],
    watchedToday: 0,
    bingerChallenge: null,
    sidebarOpen: false,
    currentTheme: 'light'
  })
})) 