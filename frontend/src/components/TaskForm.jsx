import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Tag, Flag, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const TaskForm = ({ onTaskAdded }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [task, setTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal',
        dueDate: '',
        status: 'pending'
    })
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analyzeTimeout, setAnalyzeTimeout] = useState(null)

    const analyzeTask = async (title, description) => {
        if (!title.trim()) return null

        setIsAnalyzing(true)
        try {
            const response = await axios.post('/tasks/analyze', { 
                title, 
                description: description || title 
            })
            return response.data
        } catch (error) {
            console.error('AI analysis failed:', error)
            return null
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!task.title.trim()) {
            toast.error('Please enter a task title')
            return
        }

        try {
            // Get AI analysis
            const analysis = await analyzeTask(task.title, task.description)
            
            const taskData = {
                ...task,
                ...(analysis && {
                    priority: analysis.priority || task.priority,
                    category: analysis.category || task.category,
                    dueDate: analysis.deadline || task.dueDate,
                    aiSuggestions: analysis.suggestions
                })
            }

            const response = await axios.post('/tasks', taskData)
            
            if (analysis) {
                toast.success(`Task created with AI insights! 🤖\nPriority: ${analysis.priority}\nCategory: ${analysis.category}`)
            } else {
                toast.success('Task created successfully!')
            }
            
            onTaskAdded(response.data)
            setTask({
                title: '',
                description: '',
                priority: 'medium',
                category: 'personal',
                dueDate: '',
                status: 'pending'
            })
            setIsOpen(false)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create task')
        }
    }

    const handleTitleChange = (e) => {
        const title = e.target.value
        setTask(prev => ({ ...prev, title }))

        // Debounce AI analysis
        if (analyzeTimeout) clearTimeout(analyzeTimeout)
        if (title.length > 10) {
            const timeout = setTimeout(async () => {
                if (task.title === title) {
                    const analysis = await analyzeTask(title, task.description)
                    if (analysis) {
                        setTask(prev => ({
                            ...prev,
                            priority: analysis.priority || prev.priority,
                            category: analysis.category || prev.category,
                            dueDate: analysis.deadline || prev.dueDate
                        }))
                    }
                }
            }, 1000)
            setAnalyzeTimeout(timeout)
        }
    }

    return (
        <div className="mb-8">
            {!isOpen ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(true)}
                    className="w-full glass-card p-6 text-left hover:border-purple-400 transition-all duration-300 group"
                >
                    <div className="flex items-center space-x-3">
                        <Plus className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
                        <span className="text-gray-300 group-hover:text-white">Add a new task...</span>
                        <Sparkles className="h-4 w-4 text-purple-400 ml-auto animate-pulse" />
                    </div>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-purple-400" />
                            <span>Create New Task</span>
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="What do you need to do? (AI will analyze this)"
                                value={task.title}
                                onChange={handleTitleChange}
                                className="form-input text-lg"
                                required
                            />
                            {isAnalyzing && (
                                <div className="flex items-center space-x-2 mt-2 text-purple-400">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                                    <span className="text-sm">AI is analyzing your task...</span>
                                </div>
                            )}
                        </div>

                        <textarea
                            placeholder="Add more details (optional)"
                            value={task.description}
                            onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                            className="form-input h-20 resize-none"
                            rows="3"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2 flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Due Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={task.dueDate}
                                    onChange={(e) => setTask(prev => ({ ...prev, dueDate: e.target.value }))}
                                    className="form-input"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2 flex items-center space-x-1">
                                    <Flag className="h-4 w-4" />
                                    <span>Priority</span>
                                </label>
                                <select
                                    value={task.priority}
                                    onChange={(e) => setTask(prev => ({ ...prev, priority: e.target.value }))}
                                    className="form-input"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2 flex items-center space-x-1">
                                    <Tag className="h-4 w-4" />
                                    <span>Category</span>
                                </label>
                                <select
                                    value={task.category}
                                    onChange={(e) => setTask(prev => ({ ...prev, category: e.target.value }))}
                                    className="form-input"
                                >
                                    <option value="work">Work</option>
                                    <option value="personal">Personal</option>
                                    <option value="study">Study</option>
                                    <option value="health">Health</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                disabled={isAnalyzing}
                                className="btn-primary flex items-center space-x-2 flex-1 justify-center disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                <span>{isAnalyzing ? 'Analyzing...' : 'Create Task'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    )
}

export default TaskForm
