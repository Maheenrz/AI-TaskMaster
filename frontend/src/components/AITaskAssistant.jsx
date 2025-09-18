import React, { useState, useRef, useEffect } from 'react'
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

const AITaskAssistant = ({ tasks = [], onTaskAction }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi there! I'm your AI Task Assistant. I can help you with:\n\n• Analyzing your productivity patterns\n• Suggesting task optimizations\n• Answering questions about your tasks\n• Providing motivation and tips\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quickActions] = useState([
    { icon: Clock, text: "Most urgent task?", action: "urgent" },
    { icon: Target, text: "Today's progress", action: "today" },
    { icon: TrendingUp, text: "Productivity trends", action: "trends" },
    { icon: Calendar, text: "This week's tasks", action: "week" },
    { icon: Lightbulb, text: "Productivity tips", action: "tips" },
    { icon: Zap, text: "Task optimization", action: "optimize" }
  ])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get auth token from localStorage or wherever you store it
  const getAuthToken = () => {
    // Adjust this based on how you store your auth token
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

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
      const token = getAuthToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Use the correct backend URL
      const baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://ai-task-master-abz-backend.vercel.app'
        : '';
      
      const response = await fetch(`${baseURL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageText.trim(),
          context: {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
            categories: [...new Set(tasks.map(t => t.category))],
            recentTasks: tasks.slice(0, 10)
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('Chat error:', error)
      
      let errorContent = "I'm having trouble connecting right now, but I can still help you organize your tasks! Try asking me about your current tasks or productivity patterns."
      
      if (error.message.includes('No authentication token')) {
        errorContent = "Please log in to use the AI assistant features."
      } else if (error.message.includes('404')) {
        errorContent = "AI service is currently unavailable. Please try again later."
      }

      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorContent,
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
      <div
        className={`fixed z-50 ${
          isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'
        }`}
        style={{
          transform: 'scale(1)',
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative ${
            isMobile ? 'p-3' : 'p-4'
          } bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <MessageSquare className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} group-hover:scale-110 transition-transform`} />
          
          {!isMobile && (
            <div className="absolute -top-12 -left-8 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ask me anything!
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          )}
        </button>
      </div>
    )
  }

  return (
    <div
      className={`fixed z-50 ${
        isMobile 
          ? 'inset-x-2 bottom-2 top-20' 
          : `bottom-6 right-6 ${isMinimized ? 'w-80' : 'w-96'}`
      } transition-all duration-300`}
      style={{
        transform: 'scale(1)',
        animation: 'scaleIn 0.3s ease-out'
      }}
    >
      <div className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-2xl ${
        isMobile ? 'h-full flex flex-col' : ''
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Task Assistant</h3>
              <p className="text-purple-200 text-xs">Always here to help!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-purple-200 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-purple-200 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {(!isMinimized || isMobile) && (
          <>
            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
              <p className="text-sm text-gray-400 mb-3">Quick questions:</p>
              <div className={`grid gap-2 ${
                isMobile ? 'grid-cols-1' : 'grid-cols-2'
              }`}>
                {quickActions.slice(0, isMobile ? 6 : 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 p-2 bg-gray-900 hover:bg-purple-600/20 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                  >
                    <action.icon className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className={`overflow-y-auto p-4 space-y-4 ${
              isMobile ? 'flex-1' : 'h-80'
            }`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    animation: 'slideIn 0.3s ease-out'
                  }}
                >
                  <div className={`flex items-start space-x-2 ${
                    isMobile ? 'max-w-[85%]' : 'max-w-xs'
                  } ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full flex-shrink-0 ${
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
                </div>
              ))}

              {isLoading && (
                <div
                  className="flex justify-start"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    animation: 'slideIn 0.3s ease-out'
                  }}
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
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isMobile ? "Ask about tasks..." : "Ask about your tasks, productivity, or get tips..."}
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
                        className="px-2 py-1 text-xs bg-gray-900 text-gray-400 rounded hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
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

        {/* Minimized view (desktop only) */}
        {isMinimized && !isMobile && (
          <div className="p-4 text-center">
            <Sparkles className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">AI Assistant ready to help!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default AITaskAssistant