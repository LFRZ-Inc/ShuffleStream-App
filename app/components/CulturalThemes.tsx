import { useCulturalThemes } from '@/hooks/useCulturalThemes'
import { Switch } from './ui/switch'
import { 
  Heart,
  Church,
  Vote,
  Scale,
  Palette
} from 'lucide-react'
import { motion } from 'framer-motion'

const themes = [
  {
    id: 'pride',
    label: 'Pride Content',
    icon: Heart,
    description: 'LGBTQ+ movies and shows'
  },
  {
    id: 'religious',
    label: 'Religious Content',
    icon: Church,
    description: 'Faith-based and spiritual content'
  },
  {
    id: 'political',
    label: 'Political Content',
    icon: Vote,
    description: 'Political documentaries and dramas'
  },
  {
    id: 'socialJustice',
    label: 'Social Justice',
    icon: Scale,
    description: 'Content focused on social issues'
  }
] as const

type ThemeId = typeof themes[number]['id']

export function CulturalThemes({ userId }: { userId: string }) {
  const {
    preferences,
    loading,
    error,
    updateTheme,
    toggleThematicUI,
    getCurrentTheme
  } = useCulturalThemes(userId)

  if (loading) {
    return <div>Loading preferences...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const currentTheme = getCurrentTheme()

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Cultural Themes
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Thematic UI</span>
          <Switch
            checked={preferences.thematicUI}
            onCheckedChange={toggleThematicUI}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themes.map(theme => {
          const isEnabled = preferences.culturalThemes[theme.id as keyof typeof preferences.culturalThemes]
          const ThemeIcon = theme.icon

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                p-4 rounded-lg border
                ${isEnabled ? 'border-primary/20' : 'border-muted'}
                hover:bg-accent/5 transition-colors
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ThemeIcon className="w-4 h-4" />
                    <h3 className="font-medium">{theme.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked: boolean) => updateTheme(theme.id, checked)}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {currentTheme !== 'default' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 rounded-lg bg-accent/10"
        >
          <p className="text-sm">
            Currently active theme: <span className="font-medium capitalize">{currentTheme}</span>
          </p>
        </motion.div>
      )}
    </div>
  )
} 