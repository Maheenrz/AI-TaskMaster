import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Calendar, 
  Tag, 
  Flag, 
  Edit2, 
  Trash2, 
  Clock,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [editingTask, setEditingTask] = useState(null)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400'
    }
  }

  const getCategoryIcon = (category) => {
    const iconClass = 'h-4 w-4'
    switch (category) {
      case 'work': return <Tag className={`${iconClass} text-blue-400`} />
      case 'personal': return <Tag className={`${iconClass} text-purple-400`} />
      case 'study': return <Tag className={`${iconClass} text-green-400`} />
      case 'health': return <Tag className={`${iconClass} text-red-400`} />
      default: return <Tag className={`${iconClass} text-gray-400`} />
    }
  }

  const handleStatusToggle = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      const response = await axios.put(`/tasks/${taskId}`, { status: newStatus })
      onTaskUpdated(response.data)
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}!`)
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await axios.delete(`/tasks/${taskId}`)
      onTaskDeleted(taskId)
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-400' }
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-400' }
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-400' }
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-blue-400' }
    return { text: date.toLocaleDateString(), color: 'text-gray-400' }
  }

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'all') return true
      if (filter === 'completed') return task.status === 'completed'
      if (filter === 'pending') return task.status === 'pending'
      return task.category === filter
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-purple-400" />
            <span className="text-white font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'pending', 'completed', 'work', 'personal', 'study'].map(filterOption => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  filter === filterOption
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
        </div>
      </div>

      {/* Task Count */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} 
          {filter !== 'all' ? ` (${filter})` : ''}
        </span>
        <span>
          {tasks.filter(t => t.status === 'completed').length} completed of {tasks.length} total
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map((task) => {
            const dueInfo = formatDate(task.dueDate)
            
            return (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`task-card ${task.status === 'completed' ? 'status-completed' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleStatusToggle(task._id, task.status)}
                    className="mt-1 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {task.status === 'completed' ? 
                      <CheckCircle className="h-5 w-5" /> : 
                      <Circle className="h-5 w-5" />
                    }
                  </button>

                  <div className="flex-1">
                    <h3 className={`task-title font-medium mb-2 ${
                      task.status === 'completed' ? 'text-gray-400' : 'text-white'
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(task.category)}
                        <span className="text-gray-300 capitalize">{task.category}</span>
                      </div>

                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                        <Flag className="h-3 w-3" />
                        <span className="capitalize">{task.priority}</span>
                      </div>

                      {dueInfo && (
                        <div className={`flex items-center space-x-1 ${dueInfo.color}`}>
                          <Calendar className="h-3 w-3" />
                          <span>{dueInfo.text}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-400/10 transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-gray-400 mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </div>
            <div className="text-sm text-gray-500">
              {filter === 'all' 
                ? 'Create your first task to get started!' 
                : 'Try changing your filter or create a new task'
              }
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TaskList