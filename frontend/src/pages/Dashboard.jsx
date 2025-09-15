import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import toast from 'react-hot-toast'
import axios from 'axios'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState(null)

  useEffect(() => {
    fetchTasks()
    fetchAISummary()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks')
      setTasks(response.data)
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

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
    fetchAISummary() // Refresh AI summary when new task is added
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ))
    fetchAISummary() // Refresh AI summary when task is updated
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId))
    fetchAISummary() // Refresh AI summary when task is deleted
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
            <p className="text-white">Loading your tasks...</p>
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
        {/* AI Summary Card */}
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8 border-purple-400/40"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Weekly Summary</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{aiSummary.summary}</p>
            {aiSummary.insights && aiSummary.insights.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-purple-300">Key Insights:</h4>
                <ul className="space-y-1">
                  {aiSummary.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
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
            className="glass-card p-6"
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
            className="glass-card p-6"
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
            className="glass-card p-6"
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
            className="glass-card p-6"
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
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Completion Rate</h3>
            <span className="text-2xl font-bold text-purple-400">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, delay: 0.7 }}
              className="bg-gradient-to-r from-purple-600 to-purple-400 h-3 rounded-full"
            />
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
    </div>
  )
}

export default Dashboard