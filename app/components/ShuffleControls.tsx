import { useState } from 'react'
import { useShuffleStore } from '@/store/useShuffleStore'
import { ShuffleModeType } from '@/types'
import { Button } from './ui/button'
import { 
  Shuffle, 
  ThumbsUp, 
  ThumbsDown, 
  Play, 
  Pause,
  Tv,
  List,
  Heart,
  Settings
} from 'lucide-react'

const shuffleModes: { id: ShuffleModeType; label: string; icon: any }[] = [
  { id: 'full', label: 'Full Shuffle', icon: Shuffle },
  { id: 'preference', label: 'Smart Shuffle', icon: ThumbsUp },
  { id: 'cable', label: 'Cable Mode', icon: Tv },
  { id: 'list', label: 'From List', icon: List },
  { id: 'show', label: 'Show Shuffle', icon: Heart }
]

export function ShuffleControls() {
  const [selectedMode, setSelectedMode] = useState<ShuffleModeType>('full')
  const { 
    isPlaying,
    startShuffle,
    stopShuffle,
    nextContent,
    previousContent,
    currentContent
  } = useShuffleStore()

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Mode Selection */}
      <div className="flex gap-2">
        {shuffleModes.map(mode => (
          <Button
            key={mode.id}
            variant={selectedMode === mode.id ? 'default' : 'outline'}
            onClick={() => setSelectedMode(mode.id)}
            className="flex items-center gap-2"
          >
            <mode.icon className="w-4 h-4" />
            <span>{mode.label}</span>
          </Button>
        ))}
      </div>

      {/* Playback Controls */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => previousContent()}
          disabled={!currentContent}
        >
          <ThumbsDown className="w-4 h-4" />
        </Button>

        <Button
          size="lg"
          onClick={() => isPlaying ? stopShuffle() : startShuffle(selectedMode, [])}
          className="flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Shuffle</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => nextContent()}
          disabled={!currentContent}
        >
          <ThumbsUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  )
} 