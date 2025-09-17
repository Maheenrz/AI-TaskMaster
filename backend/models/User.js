const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    theme: { type: String, default: 'dark' },
    notifications: { type: Boolean, default: true }
  },
  stats: {
    tasksCreated: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.__v
      return ret
    }
  }
})

// userSchema.index({ email: 1 })

module.exports = mongoose.model('User', userSchema)