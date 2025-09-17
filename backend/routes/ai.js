const express = require('express')
const auth = require('../middleware/auth')
const aiService = require('../services/aiService')
const Task = require('../models/Task')

const router = express.Router()

// Chat with AI
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body
    
    if (!message || message.length > 500) {
      return res.status(400).json({ error: 'Invalid message' })
    }

    const userTasks = await Task.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    const response = await aiService.chatWithTasks(message, userTasks)
    
    res.json({ response })
  } catch (error) {
    res.json({ 
      response: "I'm having trouble with AI features right now, but I'm still here to help organize your tasks!"
    })
  }
})

// Get motivational message
router.post('/motivational-message', auth, async (req, res) => {
  try {
    const recentTasks = await Task.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    const completed = recentTasks.filter(t => t.status === 'completed').length
    const total = recentTasks.length

    let message = "You're doing great! Keep up the momentum!"
    let emoji = "💪"

    if (total === 0) {
      message = "Ready to start your productivity journey? Let's create your first task!"
      emoji = "🚀"
    } else if (completed === total) {
      message = "Amazing! You've completed all your recent tasks! Time for new challenges!"
      emoji = "🎉"
    } else if (completed / total > 0.7) {
      message = "Excellent work! You're crushing your tasks with great consistency!"
      emoji = "⚡"
    }

    res.json({
      message,
      emoji,
      stats: {
        completed,
        total,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    })
  } catch (error) {
    res.json({
      message: "You're awesome! Keep pushing forward!",
      emoji: "🌟",
      stats: { completed: 0, total: 0, completionRate: 0 }
    })
  }
})

module.exports = router