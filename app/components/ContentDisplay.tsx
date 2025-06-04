import { useShuffleStore } from '@/store/useShuffleStore'
import { Content } from '@/types'
import { Button } from './ui/button'
import { Play, Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface ContentCardProps {
  content: Content
  onPlay: () => void
}

function ContentCard({ content, onPlay }: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative w-full max-w-2xl rounded-lg overflow-hidden shadow-xl"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={content.thumbnailUrl}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm opacity-80">{content.releaseYear}</span>
          <span className="text-sm opacity-80">{content.duration} min</span>
          <span className="text-sm opacity-80">Rating: {content.rating}</span>
        </div>

        <p className="text-sm opacity-90 line-clamp-2 mb-4">
          {content.description}
        </p>

        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={onPlay}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>Play Now</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export function ContentDisplay() {
  const { currentContent, launchContent } = useShuffleStore()

  if (!currentContent) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center p-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Ready to Start Shuffling?
          </h3>
          <p className="text-muted-foreground">
            Select a shuffle mode and hit play to start discovering content
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <ContentCard
        content={currentContent}
        onPlay={() => launchContent(currentContent)}
      />
    </div>
  )
} 