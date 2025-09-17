const express = require('express')
const Task = require('../models/Task')
const User = require('../models/User')
const auth = require('../middleware/auth')
const aiService = require('../services/aiService')

const router = express.Router()

// Analyze task with AI
router.post('/analyze', auth, async (req, res) => {
  try {
    const { title, description } = req.body
    const analysis = await aiService.analyzeTask(title, description)
    res.json(analysis)
  } catch (error) {
    res.status(500).json({ error: 'AI analysis failed' })
  }
})

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id
    })
    await task.save()
    
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.tasksCreated': 1 }
    })
    
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const oldTask = await Task.findOne({ _id: req.params.id, userId: req.user.id })
    if (!oldTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )

    // Update completion stats
    if (oldTask.status !== 'completed' && req.body.status === 'completed') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'stats.tasksCompleted': 1 }
      })
    } else if (oldTask.status === 'completed' && req.body.status !== 'completed') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'stats.tasksCompleted': -1 }
      })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Update user stats
    const updates = { 'stats.tasksCreated': -1 }
    if (task.status === 'completed') {
      updates['stats.tasksCompleted'] = -1
    }
    await User.findByIdAndUpdate(req.user.id, { $inc: updates })

    res.json({ message: 'Task deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { range = 'week' } = req.query
    const days = range === 'month' ? 30 : range === 'year' ? 365 : 7
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const tasks = await Task.find({
      userId: req.user.id,
      createdAt: { $gte: startDate }
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Group by category and priority
    const tasksByCategory = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {})

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {})

    res.json({
      totalTasks,
      completedTasks,
      completionRate,
      averageTasksPerDay: Math.round((totalTasks / days) * 10) / 10,
      productivityScore: completionRate,
      tasksByCategory: Object.entries(tasksByCategory).map(([category, count]) => ({ category, count })),
      tasksByPriority: Object.entries(tasksByPriority).map(([priority, count]) => ({ priority, count })),
      recentTasks: tasks.slice(-6)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get AI summary
router.get('/ai-summary', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)

    if (tasks.length === 0) {
      return res.json({
        summary: "You haven't created any tasks yet. Start by adding your first task!",
        insights: []
      })
    }

    const summary = await aiService.generateTaskSummary(tasks)
    res.json(summary)
  } catch (error) {
    res.json({
      summary: 'Keep up the great work on your tasks!',
      insights: ['Try breaking large tasks into smaller steps', 'Set realistic deadlines']
    })
  }
})

module.exports = router