import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { 
  Content, 
  ShuffleModeType, 
  ShufflePreferences, 
  Platform, 
  ShuffleState,
  PlatformType
} from '@/types'
import { shuffle } from '@/utils/shuffle'

interface ShuffleStore extends ShuffleState {
  // Platform management
  platforms: Platform[];
  setPlatforms: (platforms: Platform[]) => void;
  togglePlatform: (platformId: PlatformType) => void;
  
  // Preferences
  preferences: ShufflePreferences;
  setPreferences: (preferences: ShufflePreferences) => void;
  
  // Shuffle controls
  startShuffle: (mode: ShuffleModeType, content: Content[]) => void;
  stopShuffle: () => void;
  nextContent: () => void;
  previousContent: () => void;
  
  // Content management
  addToQueue: (content: Content[]) => void;
  removeFromQueue: (contentId: string) => void;
  clearQueue: () => void;
  
  // Deep linking
  launchContent: (content: Content) => Promise<void>;
}

const defaultPreferences: ShufflePreferences = {
  genres: [],
  minRating: 0,
  maxDuration: 0,
  contentTypes: ['movie', 'series', 'episode'],
  excludedPlatforms: []
}

const defaultPlatforms: Platform[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    color: '#E50914',
    deepLinkPrefix: 'netflix://',
    isConnected: false
  },
  {
    id: 'disney+',
    name: 'Disney+',
    color: '#113CCF',
    deepLinkPrefix: 'disneyplus://',
    isConnected: false
  },
  {
    id: 'hulu',
    name: 'Hulu',
    color: '#1CE783',
    deepLinkPrefix: 'hulu://',
    isConnected: false
  },
  {
    id: 'prime',
    name: 'Prime Video',
    color: '#00A8E1',
    deepLinkPrefix: 'primevideo://',
    isConnected: false
  },
  {
    id: 'hbo',
    name: 'HBO Max',
    color: '#A660FF',
    deepLinkPrefix: 'hbomax://',
    isConnected: false
  },
  {
    id: 'apple',
    name: 'Apple TV+',
    color: '#000000',
    deepLinkPrefix: 'appletv://',
    isConnected: false
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    color: '#0064FF',
    deepLinkPrefix: 'paramountplus://',
    isConnected: false
  },
  {
    id: 'peacock',
    name: 'Peacock',
    color: '#000000',
    deepLinkPrefix: 'peacocktv://',
    isConnected: false
  }
]

export const useShuffleStore = create<ShuffleStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        mode: null,
        isPlaying: false,
        currentContent: null,
        queue: [],
        history: [],
        platforms: defaultPlatforms,
        preferences: defaultPreferences,
        
        // Platform management
        setPlatforms: (platforms) => set({ platforms }),
        togglePlatform: (platformId) => set((state) => ({
          platforms: state.platforms.map(p => 
            p.id === platformId ? { ...p, isConnected: !p.isConnected } : p
          )
        })),
        
        // Preferences management
        setPreferences: (preferences) => set({ preferences }),
        
        // Shuffle controls
        startShuffle: (mode, content) => {
          const state = get()
          const shuffled = shuffle(mode, content, {
            preferences: state.preferences,
            currentGenre: state.currentContent?.genres[0]?.id
          })
          
          set({
            mode,
            isPlaying: true,
            queue: shuffled,
            currentContent: shuffled[0] || null,
            history: state.currentContent ? [...state.history, state.currentContent] : []
          })
        },
        
        stopShuffle: () => set({ isPlaying: false }),
        
        nextContent: () => {
          const state = get()
          if (state.queue.length <= 1) return
          
          const [current, ...remaining] = state.queue
          set({
            queue: remaining,
            currentContent: remaining[0] || null,
            history: current ? [...state.history, current] : state.history
          })
        },
        
        previousContent: () => {
          const state = get()
          if (state.history.length === 0) return
          
          const previous = state.history[state.history.length - 1]
          set({
            currentContent: previous,
            queue: [previous, ...state.queue],
            history: state.history.slice(0, -1)
          })
        },
        
        // Queue management
        addToQueue: (content) => set((state) => ({
          queue: [...state.queue, ...content]
        })),
        
        removeFromQueue: (contentId) => set((state) => ({
          queue: state.queue.filter(c => c.id !== contentId)
        })),
        
        clearQueue: () => set({ queue: [] }),
        
        // Deep linking
        launchContent: async (content) => {
          const platform = get().platforms.find(p => p.id === content.platformId)
          if (!platform) throw new Error('Platform not found')
          
          // Open deep link
          window.location.href = content.deepLinkUrl
          
          // Fallback to web URL if deep link fails
          setTimeout(() => {
            window.location.href = `https://www.${platform.id}.com`
          }, 2500)
        }
      }),
      {
        name: 'shuffle-storage',
        partialize: (state) => ({
          preferences: state.preferences,
          platforms: state.platforms
        })
      }
    )
  )
) 