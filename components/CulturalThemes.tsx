'use client'

import { useState } from 'react'
import { Heart, Flag, Globe, Sparkles, Palette } from 'lucide-react'

interface Theme {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: any
}

const themes: Theme[] = [
  {
    id: 'pride',
    name: 'Pride Content',
    description: 'LGBTQ+ movies and shows',
    enabled: true,
    icon: Heart
  },
  {
    id: 'religious',
    name: 'Religious Holidays',
    description: 'Faith-based seasonal content',
    enabled: false,
    icon: Sparkles
  },
  {
    id: 'political',
    name: 'Political Content',
    description: 'News and political documentaries',
    enabled: true,
    icon: Flag
  },
  {
    id: 'cultural',
    name: 'Cultural Events',
    description: 'Heritage months and celebrations',
    enabled: true,
    icon: Globe
  },
  {
    id: 'themed',
    name: 'Themed UI',
    description: 'Seasonal interface changes',
    enabled: false,
    icon: Palette
  }
]

export function CulturalThemes() {
  const [themePreferences, setThemePreferences] = useState<Theme[]>(themes)

  const toggleTheme = (themeId: string) => {
    setThemePreferences(prev =>
      prev.map(theme =>
        theme.id === themeId
          ? { ...theme, enabled: !theme.enabled }
          : theme
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Globe className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Cultural Themes</h2>
          <p className="text-sm text-gray-400">Customize your content visibility</p>
        </div>
      </div>

      <div className="grid gap-3">
        {themePreferences.map((theme) => {
          const Icon = theme.icon
          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                theme.enabled
                  ? 'bg-purple-500/20 border-purple-500/30'
                  : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">{theme.name}</h3>
                  <p className="text-sm text-gray-400">{theme.description}</p>
                </div>
                <div className={`ml-auto p-1 rounded-full ${
                  theme.enabled ? 'bg-purple-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    theme.enabled ? 'bg-white translate-x-full' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
} 