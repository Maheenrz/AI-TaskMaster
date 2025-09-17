import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Sparkles, Brain } from 'lucide-react'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import AITaskAssistant from '../components/AITaskAssistant'
import toast from 'react-hot-toast'
import axios from 'axios'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState(null)
  const [motivationalMessage, setMotivationalMessage] = useState(null)

  useEffect(() => {
    fetchTasks()
    fetchAISummary()
    fetchMotivationalMessage()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks')
      setTasks(response.data.tasks || response.data)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchAISummary = async () => {
    try {
      const response = await axios.get('/tasks/ai-summary')
      setAiSummary(response.data)
    } catch (error) {
      console.error('Failed to fetch AI summary:', error)
    }
  }

  const fetchMotivationalMessage = async () => {
    try {
      const response = await axios.post('/api/ai/motivational-message')
      setMotivationalMessage(response.data)
    } catch (error) {
      console.error('Failed to fetch motivational message:', error)
    }
  }

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
    fetchAISummary()
    fetchMotivationalMessage()
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ))
    fetchAISummary()
    fetchMotivationalMessage()
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId))
    fetchAISummary()
    fetchMotivationalMessage()
  }

  const handleTaskAction = (action, taskId) => {
    // Handle actions from AI assistant (if needed)
    console.log('Task action:', action, taskId)
  }

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const pendingTasks = tasks.filter(task => task.status === 'pending').length
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false
    return new Date(task.dueDate) < new Date()
  }).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (loading) {
    return (
      <div className="galaxy-bg min-h-screen">
        <div className="stars"></div>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white">Loading your AI-powered workspace...</p>
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
        {/* Motivational Message */}
        {motivationalMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8 border-purple-400/40 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 animate-pulse"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{motivationalMessage.emoji}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Daily Motivation</h3>
                  <p className="text-gray-300 leading-relaxed">{motivationalMessage.message}</p>
                </div>
              </div>
              <div className="text-right text-sm text-purple-300">
                <div>Completion Rate</div>
                <div className="text-2xl font-bold">{motivationalMessage.stats?.completionRate || 0}%</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Summary Card */}
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8 border-purple-400/40"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Weekly Summary</h3>
              <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">{aiSummary.summary}</p>
            {aiSummary.insights && aiSummary.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-300">Key Insights:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {aiSummary.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start space-x-2 bg-gray-800/30 p-3 rounded-lg">
                      <span className="text-purple-400 mt-1 flex-shrink-0">💡</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
                <p className="text-sm text-gray-400">Total Tasks</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{completedTasks}</p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingTasks}</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-600/20 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{overdueTasks}</p>
                <p className="text-sm text-gray-400">Overdue</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mb-8 hover:scale-102 transition-transform duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span>Productivity Score</span>
            </h3>
            <span className="text-2xl font-bold text-purple-400">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 h-4 rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Getting Started</span>
            <span>Productive</span>
            <span>Exceptional</span>
          </div>
        </motion.div>

        {/* Task Management */}
        <div className="grid lg:grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <TaskForm onTaskAdded={handleTaskAdded} />
            <TaskList 
              tasks={tasks}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          </motion.div>
        </div>
      </div>

      {/* AI Task Assistant */}
      <AITaskAssistant 
        tasks={tasks}
        onTaskAction={handleTaskAction}
      />
    </div>
  )
}

export default Dashboard