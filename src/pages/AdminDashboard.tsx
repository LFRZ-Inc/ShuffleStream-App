import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Film, 
  BarChart3, 
  Settings, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Database,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Star,
  Play,
  Plus
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'suspended' | 'banned';
  watchTime: number;
  contentWatched: number;
  subscription: 'free' | 'premium';
}

interface Content {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'documentary';
  platform: string;
  addedDate: string;
  status: 'active' | 'pending' | 'flagged';
  views: number;
  rating: number;
  reports: number;
}

interface SystemMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const systemMetrics: SystemMetric[] = [
    { label: 'Total Users', value: '125,847', change: '+12.5%', trend: 'up' },
    { label: 'Active Users (24h)', value: '23,456', change: '+8.2%', trend: 'up' },
    { label: 'Content Items', value: '45,892', change: '+156', trend: 'up' },
    { label: 'Platform Integrations', value: '12', change: '0', trend: 'stable' },
    { label: 'Total Watch Time', value: '2.3M hrs', change: '+15.7%', trend: 'up' },
    { label: 'Shuffle Sessions', value: '89,234', change: '+22.1%', trend: 'up' },
    { label: 'Content Reports', value: '47', change: '-12.3%', trend: 'down' },
    { label: 'System Uptime', value: '99.97%', change: '+0.02%', trend: 'up' }
  ];

  const recentUsers: User[] = [
    {
      id: '1',
      username: 'moviebuff2024',
      email: 'user@example.com',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      status: 'active',
      watchTime: 245,
      contentWatched: 89,
      subscription: 'premium'
    },
    {
      id: '2',
      username: 'streamfan',
      email: 'fan@example.com',
      joinDate: '2024-01-14',
      lastActive: '2024-01-19',
      status: 'active',
      watchTime: 156,
      contentWatched: 67,
      subscription: 'free'
    },
    {
      id: '3',
      username: 'bingewatcher',
      email: 'binge@example.com',
      joinDate: '2024-01-13',
      lastActive: '2024-01-18',
      status: 'suspended',
      watchTime: 89,
      contentWatched: 34,
      subscription: 'free'
    }
  ];

  const recentContent: Content[] = [
    {
      id: '1',
      title: 'The Crown',
      type: 'tv',
      platform: 'Netflix',
      addedDate: '2024-01-20',
      status: 'active',
      views: 15420,
      rating: 4.8,
      reports: 0
    },
    {
      id: '2',
      title: 'Dune: Part Two',
      type: 'movie',
      platform: 'HBO Max',
      addedDate: '2024-01-19',
      status: 'pending',
      views: 8934,
      rating: 4.9,
      reports: 2
    },
    {
      id: '3',
      title: 'Planet Earth III',
      type: 'documentary',
      platform: 'BBC iPlayer',
      addedDate: '2024-01-18',
      status: 'flagged',
      views: 5678,
      rating: 4.7,
      reports: 5
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Management', icon: Film },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'flagged': return 'text-red-400';
      case 'suspended': return 'text-orange-400';
      case 'banned': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {getTrendIcon(metric.trend)}
            </div>
            <div className="flex items-center mt-2">
              <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {metric.change}
              </span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Users</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {recentUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">{user.joinDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Content</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {recentContent.slice(0, 5).map((content) => (
              <div key={content.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{content.title}</p>
                  <p className="text-gray-400 text-sm">{content.platform} • {content.type}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}>
                    {content.status}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">{content.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Add Content
          </button>
          <button className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-2" />
            Manage Users
          </button>
          <button className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </button>
          <button className="flex items-center justify-center p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Review Reports
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Watch Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{user.username}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.subscription === 'premium' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.watchTime}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <Film className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total Content</p>
              <p className="text-2xl font-bold text-white">45,892</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">43,567</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">1,892</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Flagged</p>
              <p className="text-2xl font-bold text-white">433</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Content Library</h3>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentContent.map((content) => (
                <tr key={content.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{content.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
                      {content.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {content.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}>
                      {content.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {content.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-300">{content.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Platform Analytics</h3>
        <p className="text-gray-400">Detailed analytics dashboard coming soon...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">User Engagement</h4>
            <p className="text-2xl font-bold text-purple-400">87.3%</p>
            <p className="text-gray-400 text-sm">Daily active users</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Content Discovery</h4>
            <p className="text-2xl font-bold text-blue-400">92.1%</p>
            <p className="text-gray-400 text-sm">Shuffle success rate</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Platform Usage</h4>
            <p className="text-2xl font-bold text-green-400">156 min</p>
            <p className="text-gray-400 text-sm">Avg. session duration</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Content Moderation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <h4 className="text-white font-medium">Pending Reports</h4>
            </div>
            <p className="text-2xl font-bold text-red-400">47</p>
            <p className="text-gray-400 text-sm">Requires review</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-yellow-400 mr-2" />
              <h4 className="text-white font-medium">Under Review</h4>
            </div>
            <p className="text-2xl font-bold text-yellow-400">23</p>
            <p className="text-gray-400 text-sm">Being processed</p>
          </div>
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="text-white font-medium">Resolved Today</h4>
            </div>
            <p className="text-2xl font-bold text-green-400">156</p>
            <p className="text-gray-400 text-sm">Successfully handled</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { id: 1, content: 'Inappropriate content in "Movie Title"', type: 'Content', status: 'pending', time: '2 hours ago' },
            { id: 2, content: 'User harassment report', type: 'User', status: 'reviewing', time: '4 hours ago' },
            { id: 3, content: 'Copyright violation claim', type: 'Content', status: 'pending', time: '6 hours ago' }
          ].map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="text-white font-medium">{report.content}</p>
                <p className="text-gray-400 text-sm">{report.type} • {report.time}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform API Keys
              </label>
              <button className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-left text-white hover:bg-gray-600">
                Manage API Integrations
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Moderation Settings
              </label>
              <button className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-left text-white hover:bg-gray-600">
                Configure Moderation Rules
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User Permissions
              </label>
              <button className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-left text-white hover:bg-gray-600">
                Manage User Roles
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                System Maintenance
              </label>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white">
                Schedule Maintenance
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Database Management
              </label>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                Database Tools
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Backup & Recovery
              </label>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white">
                Backup Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300">Database</span>
            <span className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              Online
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300">API Services</span>
            <span className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300">CDN</span>
            <span className="flex items-center text-yellow-400">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Degraded
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUserManagement();
      case 'content': return renderContentManagement();
      case 'analytics': return renderAnalytics();
      case 'moderation': return renderModeration();
      case 'system': return renderSystemSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage ShuffleStream platform and users</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 