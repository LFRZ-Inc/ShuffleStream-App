'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Film, 
  BarChart3, 
  Settings, 
  Shield, 
  TrendingUp,
  Bell
} from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const systemMetrics = [
    { label: 'Total Users', value: '125,847', change: '+12.5%', trend: 'up' },
    { label: 'Active Users (24h)', value: '23,456', change: '+8.2%', trend: 'up' },
    { label: 'Content Items', value: '45,892', change: '+156', trend: 'up' },
    { label: 'Platform Integrations', value: '12', change: '0', trend: 'stable' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Management', icon: Film },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your ShuffleStream platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
                <span className="text-white font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                </div>
                <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-400' : 'text-gray-400'}`} />
              </div>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-gray-400'}`}>
                  {metric.change}
                </span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
          <p className="text-gray-400">
            {activeTab === 'overview' && 'System overview and key metrics for ShuffleStream platform.'}
            {activeTab === 'users' && 'Manage user accounts, permissions, and moderation.'}
            {activeTab === 'content' && 'Content library management and approval workflow.'}
            {activeTab === 'analytics' && 'Platform analytics and user engagement insights.'}
            {activeTab === 'moderation' && 'Content and user moderation tools and reports.'}
            {activeTab === 'system' && 'System configuration, API settings, and maintenance.'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Admin Dashboard - ShuffleStream',
  description: 'Administrative dashboard for managing ShuffleStream platform',
} 