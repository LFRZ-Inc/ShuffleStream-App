'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Shield, 
  Heart,
  ArrowLeft,
  Star
} from 'lucide-react'

export default function ProPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  const features = {
    free: [
      'Basic shuffle modes',
      'Limited platform connections',
      'Standard content library',
      'Basic recommendations'
    ],
    pro: [
      'All shuffle modes',
      'Unlimited platform connections',
      'Premium content library',
      'AI-powered recommendations',
      'Custom shuffle packs',
      'Advanced filters',
      'Priority support',
      'Early access to new features',
      'Offline mode',
      'Family sharing (up to 6 members)'
    ]
  }

  const pricing = {
    monthly: { price: 9.99, period: 'month' },
    yearly: { price: 99.99, period: 'year', savings: '17%' }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">ShuffleStream Pro</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Unlock the full potential</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upgrade to Pro
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get unlimited access to all shuffle modes, premium content, and AI-powered recommendations 
            that learn from your viewing habits.
          </p>
        </motion.div>
      </section>

      {/* Pricing Toggle */}
      <section className="px-6 mb-12">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-xl p-2 flex">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all relative ${
                selectedPlan === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save {pricing.yearly.savings}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-bold">ShuffleStream Pro</h3>
          </div>
          
          <div className="mb-6">
            <span className="text-5xl font-bold">${pricing[selectedPlan].price}</span>
            <span className="text-gray-400">/{pricing[selectedPlan].period}</span>
          </div>
          
          {selectedPlan === 'yearly' && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-6">
              <p className="text-green-400 text-sm">
                Save ${(9.99 * 12 - 99.99).toFixed(2)} compared to monthly billing
              </p>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-xl font-semibold text-lg mb-6 transition-all"
          >
            Start Free Trial
          </motion.button>
          
          <p className="text-sm text-gray-400">
            7-day free trial • Cancel anytime • No commitment
          </p>
        </motion.div>
      </section>

      {/* Features Comparison */}
      <section className="px-6 mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">What's Included</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-semibold">Free Plan</h3>
              </div>
              
              <ul className="space-y-3">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-semibold">Pro Plan</h3>
              </div>
              
              <ul className="space-y-3">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 mb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-2">What platforms are supported?</h3>
              <p className="text-gray-400">We support Netflix, Disney+, Hulu, Prime Video, HBO Max, Apple TV+, Paramount+, and Peacock with more coming soon.</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Is there a family plan?</h3>
              <p className="text-gray-400">Pro includes family sharing for up to 6 members at no additional cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-12">
        <div className="max-w-md mx-auto text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-xl font-semibold text-lg mb-4 transition-all"
          >
            Start Your Free Trial
          </motion.button>
          
          <p className="text-sm text-gray-400">
            Join thousands of users who've upgraded their streaming experience
          </p>
        </div>
      </section>
    </div>
  )
} 