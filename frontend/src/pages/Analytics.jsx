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
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/tasks/analytics?range=${timeRange}`)
      setAnalytics(response.data)
    } catch (error) {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

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
            
            <div className="mt-4 md:mt-0">
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
                <p className="text-2xl font-bold text-white">{analytics.completionRate}%</p>
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
                <p className="text-2xl font-bold text-white">{analytics.averageTasksPerDay}</p>
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
                <p className="text-2xl font-bold text-white">{analytics.productivityScore}</p>
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