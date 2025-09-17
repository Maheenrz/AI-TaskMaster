import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  Tag, 
  Flag, 
  Sparkles, 
  Wand2,
  Clock,
  Brain,
  MessageSquare,
  Send,
  Mic,
  MicOff
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const TaskForm = ({ onTaskAdded }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    dueDate: '',
    status: 'pending'
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [analyzeTimeout, setAnalyzeTimeout] = useState(null)
  
  const recognitionRef = useRef(null)
  const textareaRef = useRef(null)

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript
        setTask(prev => ({ ...prev, title: speechResult }))
        setIsListening(false)
        // Trigger AI analysis after voice input
        handleTitleChange({ target: { value: speechResult } })
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        toast.error('Voice recognition failed')
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

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
          aiSuggestions: analysis.suggestions,
          estimatedTime: analysis.estimatedTime
        })
      }

      const response = await axios.post('/tasks', taskData)
      
      if (analysis) {
        toast.success(
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <div>
              <div className="font-medium">Task created with AI magic! ✨</div>
              <div className="text-xs text-gray-300">
                Priority: {analysis.priority} • Category: {analysis.category}
                {analysis.estimatedTime && ` • Est: ${analysis.estimatedTime}`}
              </div>
            </div>
          </div>
        )
      } else {
        toast.success('Task created successfully!')
      }
      
      onTaskAdded(response.data)
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
    }
  }

  const resetForm = () => {
    setTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'personal',
      dueDate: '',
      status: 'pending'
    })
    setAiSuggestions(null)
    setIsOpen(false)
    setIsExpanded(false)
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setTask(prev => ({ ...prev, title }))

    // Debounce AI analysis
    if (analyzeTimeout) clearTimeout(analyzeTimeout)
    if (title.length > 3) {
      const timeout = setTimeout(async () => {
        const analysis = await analyzeTask(title, task.description)
        if (analysis) {
          setAiSuggestions(analysis)
          setTask(prev => ({
            ...prev,
            priority: analysis.priority || prev.priority,
            category: analysis.category || prev.category,
            dueDate: analysis.deadline || prev.dueDate
          }))
        }
      }, 800)
      setAnalyzeTimeout(timeout)
    }
  }

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const quickTaskSuggestions = [
    "Review project documentation",
    "Call client about meeting",
    "Finish presentation slides",
    "Submit expense reports",
    "Plan team sprint goals"
  ]

  return (
    <div className="mb-8">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className="w-full glass-card p-6 text-left hover:border-purple-400 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-purple-400 group-hover:text-purple-300 group-hover:rotate-90 transition-all duration-300" />
                <span className="text-gray-300 group-hover:text-white transition-colors text-lg">
                  What would you like to accomplish today?
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                <Brain className="h-4 w-4 text-blue-400 animate-bounce" />
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6 relative overflow-hidden"
          >
            {/* AI Analysis Indicator */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-pulse"
                />
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Wand2 className="h-6 w-6 text-purple-400" />
                <span>Create AI-Powered Task</span>
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Smart Input with Voice Recognition */}
              <div className="relative">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  <label className="text-sm font-medium text-gray-300">
                    Describe your task (AI will analyze it)
                  </label>
                </div>
                
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    placeholder="e.g., 'Finish DBMS assignment by Friday, it's really important' or 'Weekly team meeting tomorrow at 2 PM'"
                    value={task.title}
                    onChange={handleTitleChange}
                    className="form-input text-lg resize-none h-24 pr-24"
                    required
                  />
                  
                  {/* Voice Recognition Button */}
                  <div className="absolute right-3 top-3 flex flex-col space-y-2">
                    <button
                      type="button"
                      onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isListening 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/40'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-all"
                    >
                      <Plus className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* AI Analysis Status */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2 mt-2 text-purple-400"
                    >
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                      <span className="text-sm">AI is analyzing your task...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Voice Recognition Status */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2 mt-2 text-red-400"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Listening... Speak your task</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Suggestions Display */}
              <AnimatePresence>
                {aiSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-300">AI Analysis Results</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Flag className="h-3 w-3 text-orange-400" />
                        <span className="text-gray-300">Priority: {aiSuggestions.priority}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag className="h-3 w-3 text-blue-400" />
                        <span className="text-gray-300">Category: {aiSuggestions.category}</span>
                      </div>
                      {aiSuggestions.deadline && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-green-400" />
                          <span className="text-gray-300">Due: {new Date(aiSuggestions.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      {aiSuggestions.estimatedTime && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-purple-400" />
                          <span className="text-gray-300">Est: {aiSuggestions.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                    {aiSuggestions.suggestions && (
                      <div className="mt-3 p-3 bg-blue-900/10 rounded border-l-2 border-blue-400">
                        <div className="text-xs text-blue-300 mb-1">AI Suggestion:</div>
                        <div className="text-sm text-gray-300">{aiSuggestions.suggestions}</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expanded Options */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Additional Description */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Additional Details</label>
                      <textarea
                        placeholder="Add more context, requirements, or notes..."
                        value={task.description}
                        onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                        className="form-input h-16 resize-none"
                        rows="2"
                      />
                    </div>

                    {/* Manual Overrides */}
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
                          <option value="low">🟢 Low</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="high">🔴 High</option>
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
                          <option value="work">💼 Work</option>
                          <option value="personal">🏠 Personal</option>
                          <option value="study">📚 Study</option>
                          <option value="health">🏃 Health</option>
                          <option value="other">📌 Other</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Suggestions */}
              {!task.title && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-400 mb-3">Quick suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickTaskSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setTask(prev => ({ ...prev, title: suggestion }))}
                        className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-purple-600/20 hover:text-purple-300 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isAnalyzing || !task.title.trim()}
                  className="btn-primary flex items-center space-x-2 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span>Create with AI</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TaskForm