const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'study', 'health', 'other'],
    default: 'personal'
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  dueDate: Date,
  aiSuggestions: String,
  estimatedTime: String
}, {
  timestamps: true
})

taskSchema.index({ userId: 1, createdAt: -1 })
taskSchema.index({ userId: 1, status: 1 })

module.exports = mongoose.model('Task', taskSchema)