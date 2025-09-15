// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Brain,
  Award,
  Activity,
  Zap
} from 'lucide-react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import toast from 'react-hot-toast'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week') // week, month, year

  useEffect(() => {
    fetchAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/tasks/analytics?range=${timeRange}`)
      setAnalytics(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch analytics')
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  // Color maps
  const COLORS = {
    work: '#3B82F6',
    personal: '#8B5CF6',
    study: '#10B981',
    health: '#EF4444',
    other: '#F59E0B'
  }

  const PRIORITY_COLORS = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981'
  }

  // Robust helpers in case backend shape varies
  const getCategoryData = () => {
    if (!analytics) return []
    if (Array.isArray(analytics.tasksByCategory)) return analytics.tasksByCategory
    // fallback: object { work: 10, personal: 3 }
    if (analytics.tasksByCategory && typeof analytics.tasksByCategory === 'object') {
      return Object.entries(analytics.tasksByCategory).map(([category, count]) => ({ category, count }))
    }
    if (analytics.categoryCounts && typeof analytics.categoryCounts === 'object') {
      return Object.entries(analytics.categoryCounts).map(([category, count]) => ({ category, count }))
    }
    return []
  }

  const getPriorityData = () => {
    if (!analytics) return []
    if (Array.isArray(analytics.tasksByPriority)) return analytics.tasksByPriority
    if (analytics.priorityCounts && typeof analytics.priorityCounts === 'object') {
      return Object.entries(analytics.priorityCounts).map(([priority, count]) => ({ priority, count }))
    }
    return []
  }

  const getTimeSeries = () => {
    if (!analytics) return []
    return analytics.tasksOverTime || analytics.timeSeries || []
  }

  const formatDateLabel = (d) => {
    try {
      const date = new Date(d)
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    } catch {
      return d
    }
  }

  if (loading) {
    return (
      <div className="galaxy-bg min-h-screen">
        <div className="stars"></div>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white">Analyzing your productivity...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="galaxy-bg min-h-screen">
        <div className="stars"></div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="glass-card p-12 text-center">
            <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Data Yet</h2>
            <p className="text-gray-400">Create some tasks to see your analytics!</p>
          </div>
        </div>
      </div>
    )
  }

  const categoryData = getCategoryData()
  const priorityData = getPriorityData()
  const timeSeries = getTimeSeries()
  const recentTasks = analytics.recentTasks || []

  return (
    <div className="galaxy-bg min-h-screen">
      <div className="stars"></div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">AI-powered insights into your productivity</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-purple-400/30 text-white rounded-lg px-4 py-2"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.completionRate ?? 0}%</p>
                <p className="text-sm text-gray-400">Completion Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.averageTasksPerDay ?? 0}</p>
                <p className="text-sm text-gray-400">Avg Tasks/Day</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.productivityScore ?? 0}</p>
                <p className="text-sm text-gray-400">Productivity Score</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.currentStreak ?? analytics.longestStreak ?? 0}</p>
                <p className="text-sm text-gray-400">Current Streak</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time series (left wide) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Tasks Over Time</h3>
              <div className="text-sm text-gray-400">{timeRange === 'week' ? 'Last 7 days' : timeRange === 'month' ? 'Last 30 days' : 'Last year'}</div>
            </div>

            {timeSeries.length === 0 ? (
              <div className="text-gray-400">No time-series data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeries.map((d) => ({ ...d, dateLabel: formatDateLabel(d.date || d.label || d.name) }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateLabel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="created" name="Created" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Right column: pie (priority) and bar (categories) */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Priority Distribution</h3>
              {priorityData.length === 0 ? (
                <div className="text-gray-400">No priority data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      dataKey="count"
                      nameKey={(entry) => entry.priority || entry.name}
                      innerRadius={40}
                      outerRadius={70}
                      label={(entry) => `${entry.priority ?? entry.name}: ${entry.count}`}
                    >
                      {priorityData.map((entry, index) => {
                        const key = (entry.priority || entry.name || index).toString()
                        const color = PRIORITY_COLORS[(entry.priority || entry.name || '').toLowerCase()] || '#8884d8'
                        return <Cell key={`cell-${key}`} fill={color} />
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Tasks by Category</h3>
              {categoryData.length === 0 ? (
                <div className="text-gray-400">No category data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Tasks">
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cat-${idx}`} fill={COLORS[(entry.category || '').toLowerCase()] || '#8884d8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>
        </div>

        {/* Recent tasks list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
            <div className="text-sm text-gray-400">Latest activity</div>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-gray-400">No recent tasks to show.</div>
          ) : (
            <ul className="space-y-3">
              {recentTasks.slice(0, 6).map((t, i) => (
                <li key={t._id ?? i} className="flex items-center justify-between bg-gray-900/40 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{t.title || t.name}</span>
                      <span className="text-xs text-gray-400">{t.description ? `${t.description.slice(0, 80)}${t.description.length > 80 ? '...' : ''}` : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className="text-xs px-2 py-1 rounded-md"
                      style={{ background: (COLORS[(t.category || '').toLowerCase()] || '#374151') + '22', color: '#fff' }}
                    >
                      {t.category || 'other'}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-md font-medium"
                      style={{ background: (PRIORITY_COLORS[(t.priority || '').toLowerCase()] || '#6b7280') + '22', color: '#fff' }}
                    >
                      {t.priority || 'low'}
                    </span>
                    <span className="text-xs text-gray-400">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
