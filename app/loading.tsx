import { ShuffleStreamIcon } from './icon'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-xl opacity-30 animate-pulse-slow" />
        <div className="relative animate-bounce-gentle">
          <ShuffleStreamIcon className="w-16 h-16" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-display font-bold gradient-text animate-pulse">
        Loading...
      </h2>
    </div>
  )
} 