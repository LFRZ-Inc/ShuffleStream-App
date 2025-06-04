import { useShuffleStore } from '@/store/useShuffleStore'
import { Platform } from '@/types'
import { Button } from './ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

function PlatformCard({ platform }: { platform: Platform }) {
  const { togglePlatform } = useShuffleStore()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative p-4 rounded-lg border
        ${platform.isConnected ? 'border-green-500/20' : 'border-red-500/20'}
        hover:bg-accent/5 transition-colors
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium" style={{ color: platform.color }}>
          {platform.name}
        </h3>
        {platform.isConnected ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => togglePlatform(platform.id)}
      >
        {platform.isConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </motion.div>
  )
}

export function PlatformStatus() {
  const { platforms } = useShuffleStore()
  const connectedCount = platforms.filter(p => p.isConnected).length

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Connected Platforms
        </h2>
        <span className="text-sm text-muted-foreground">
          {connectedCount} of {platforms.length} Connected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map(platform => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}
      </div>
    </div>
  )
} 