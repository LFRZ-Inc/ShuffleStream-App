'use client'

import { useState } from 'react'
import { Play, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react'

interface Content {
  id: string
  title: string
  description: string
  image: string
  platform: string
  rating: number
  year: number
}

const mockContent: Content = {
  id: '1',
  title: 'Stranger Things',
  description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
  image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  platform: 'Netflix',
  rating: 8.7,
  year: 2016
}

export function ContentDisplay() {
  const [content] = useState<Content>(mockContent)

  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
      
      <div className="relative aspect-video">
        <img
          src={content.image}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{content.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <span>{content.year}</span>
              <span>•</span>
              <span>{content.platform}</span>
              <span>•</span>
              <span>★ {content.rating}</span>
            </div>
            <p className="text-gray-300">{content.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button className="btn-primary flex items-center gap-2">
            <Play className="w-4 h-4" />
            Watch Now
          </button>
          
          <button className="btn-ghost p-2">
            <ThumbsUp className="w-5 h-5" />
          </button>
          
          <button className="btn-ghost p-2">
            <ThumbsDown className="w-5 h-5" />
          </button>
          
          <button className="btn-ghost p-2 ml-auto">
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 