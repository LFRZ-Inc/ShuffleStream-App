'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Play, 
  Shuffle, 
  Zap, 
  Users, 
  Trophy, 
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Shuffle className="w-8 h-8" />,
      title: "Smart Shuffle Modes",
      description: "5 different ways to discover content across all your platforms"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Deep Links",
      description: "Launch content directly in your streaming apps with one click"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cultural Control",
      description: "Customize what themed content you see - everything is opt-in"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Binger's Challenge",
      description: "Track your progress, compete on leaderboards, and earn rewards"
    }
  ]

  const platforms = [
    { name: "Netflix", icon: "🎬", color: "bg-red-500" },
    { name: "Disney+", icon: "🏰", color: "bg-blue-600" },
    { name: "Hulu", icon: "📺", color: "bg-green-500" },
    { name: "Prime Video", icon: "📦", color: "bg-blue-400" },
    { name: "HBO Max", icon: "👑", color: "bg-purple-600" },
    { name: "Apple TV+", icon: "🍎", color: "bg-gray-800" },
    { name: "Spotify", icon: "🎵", color: "bg-green-600" },
    { name: "YouTube Music", icon: "🎶", color: "bg-red-600" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-secondary-500/20 to-accent-500/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-xl opacity-30 animate-pulse-slow" />
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-6">
                  <Sparkles className="w-12 h-12 text-primary-500" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="gradient-text">ShuffleStream</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your smarter way to stream. Connect all your platforms, discover content with advanced shuffle features, and never wonder what to watch again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/login" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Shuffling
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link href="#features" className="btn-ghost text-lg px-8 py-4">
                Learn More
              </Link>
            </div>

            {/* Platform Icons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`${platform.color} rounded-xl p-3 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200`}
                  title={platform.name}
                >
                  <span className="text-2xl">{platform.icon}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">
              Why ShuffleStream?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're not another streaming platform. We're your smart assistant that makes your existing subscriptions work better together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card card-hover text-center"
              >
                <div className="text-primary-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shuffle Modes Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              5 Ways to <span className="gradient-text">Shuffle</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Different moods call for different discovery methods. Choose your adventure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🎲", title: "Full Shuffle", desc: "Anything, across all platforms" },
              { icon: "🎯", title: "Preference Shuffle", desc: "Based on your taste" },
              { icon: "📺", title: "Cable Mode", desc: "Endless autoplay experience" },
              { icon: "📋", title: "List Shuffle", desc: "From your curated packs" },
              { icon: "🎬", title: "Show Shuffle", desc: "Random episode from a series" }
            ].map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card card-hover text-center group"
              >
                <div className="text-4xl mb-4 group-hover:animate-bounce-gentle">
                  {mode.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{mode.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{mode.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Transform Your Streaming?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who've already discovered their new favorite way to stream.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Get Started Free
              </Link>
              
              <Link href="/demo" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200">
                Watch Demo
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4 gradient-text">
                ShuffleStream
              </h3>
              <p className="text-gray-400">
                Your smarter way to stream across all platforms.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShuffleStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 