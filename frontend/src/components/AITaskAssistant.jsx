import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Lightbulb,
  Zap
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AITaskAssistant = ({ tasks, onTaskAction }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi there! 👋 I'm your AI Task Assistant. I can help you with:\n\n• Analyzing your productivity patterns\n• Suggesting task optimizations\n• Answering questions about your tasks\n• Providing motivation and tips\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quickActions] = useState([
    { icon: Clock, text: "What's my most urgent task?", action: "urgent" },
    { icon: Target, text: "How am I doing today?", action: "today" },
    { icon: TrendingUp, text: "Show my productivity trends", action: "trends" },
    { icon: Calendar, text: "What's due this week?", action: "week" },
    { icon: Lightbulb, text: "Give me productivity tips", action: "tips" },
    { icon: Zap, text: "Suggest task optimizations", action: "optimize" }
  ])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText = currentMessage) => {
    if (!messageText.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/ai/chat', {
        message: messageText.trim(),
        context: {
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
          categories: [...new Set(tasks.map(t => t.category))],
          recentTasks: tasks.slice(0, 10)
        }
      })

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(),
        suggestions: response.data.suggestions
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm having trouble connecting right now, but I can still help you organize your tasks! Try asking me about your current tasks or productivity patterns.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action) => {
    const actionMessages = {
      urgent: "What's my most urgent task right now?",
      today: "How am I doing with my tasks today?",
      trends: "Show me my productivity trends and patterns",
      week: "What tasks are due this week?",
      tips: "Give me some productivity tips based on my task patterns",
      optimize: "How can I optimize my task management?"
    }

    await handleSendMessage(actionMessages[action])
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
          
          {/* Floating notification */}
          <div className="absolute -top-12 -left-8 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask me anything! 🤖
            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 ${
        isMinimized ? 'w-80' : 'w-96'
      } transition-all duration-300`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="glass-card overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Task Assistant</h3>
              <p className="text-purple-200 text-xs">Always here to help! ✨</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-purple-200 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-purple-200 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-700">
              <p className="text-sm text-gray-400 mb-3">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 p-2 bg-gray-800 hover:bg-purple-600/20 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                  >
                    <action.icon className="h-3 w-3" />
                    <span className="truncate">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`p-2 rounded-full ${
                        message.type === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 opacity-70 ${
                          message.type === 'user' ? 'text-purple-200' : 'text-gray-400'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-xs">
                    <div className="p-2 rounded-full bg-blue-600 text-white">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-blue-400 text-xs">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your tasks, productivity, or get tips..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !currentMessage.trim()}
                  className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              {/* Suggested questions when empty */}
              {!currentMessage && messages.length <= 1 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500">Try asking:</p>
                  <div className="flex flex-wrap gap-1">
                    {['What should I focus on?', 'Am I being productive?', 'Tips for today'].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Minimized view */}
        {isMinimized && (
          <div className="p-4 text-center">
            <Sparkles className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">AI Assistant ready to help!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AITaskAssistant