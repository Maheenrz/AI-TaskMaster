const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// Import routes (you were missing these!)
const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')
const aiRoutes = require('./routes/ai')

const app = express()

//CORS middleware needed
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ],
  credentials: true
}))


app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error)
  res.status(error.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : error.message
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// MongoDB connection - Use MONGODB_URI not MONGO_URI
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection failed:', err))

// Start server
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`)
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
// })

module.exports = app
