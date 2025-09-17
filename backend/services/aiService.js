const axios = require('axios')

class AIService {
  constructor() {
    this.mistralApiKey = process.env.MISTRAL_API_KEY
    this.mistralApiUrl = 'https://api.mistral.ai/v1/chat/completions'
    
    if (!this.mistralApiKey) {
      console.warn('⚠️  MISTRAL_API_KEY not found. AI features will use fallback responses.')
    }
  }

  async makeAPICall(messages, maxTokens = 500) {
    if (!this.mistralApiKey) {
      throw new Error('Mistral API key not configured')
    }

    try {
      const response = await axios.post(
        this.mistralApiUrl,
        {
          model: 'mistral-small-latest',
          messages,
          max_tokens: maxTokens,
          temperature: 0.3,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.mistralApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      )

      return JSON.parse(response.data.choices[0].message.content)
    } catch (error) {
      console.error('Mistral API Error:', error.response?.data || error.message)
      throw error
    }
  }

  async analyzeTask(title, description = '') {
    try {
      const prompt = `Analyze this task and provide structured information in JSON format:

Task: "${title}"
Description: "${description}"

Please analyze and return a JSON object with the following structure:
{
  "priority": "low|medium|high",
  "category": "work|personal|study|health|other",
  "deadline": "YYYY-MM-DD format if detectable, otherwise null",
  "estimatedTime": "estimated time like '2 hours', '30 minutes', etc.",
  "suggestions": "brief helpful tip or insight about this task"
}

Analysis guidelines:
- Priority: high for urgent/important items, medium for regular tasks, low for casual items
- Category: classify based on context (work, personal, study, health, other)
- Deadline: extract any date/time mentions (today, tomorrow, Friday, etc.)
- EstimatedTime: realistic estimate based on task complexity
- Suggestions: actionable advice for completing the task efficiently

Focus on being practical and helpful.`

      const messages = [
        {
          role: 'system',
          content: 'You are an AI task management assistant that helps users organize and prioritize their tasks efficiently. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]

      const analysis = await this.makeAPICall(messages, 400)

      // Validate and set defaults
      const result = {
        priority: ['low', 'medium', 'high'].includes(analysis.priority) ? analysis.priority : 'medium',
        category: ['work', 'personal', 'study', 'health', 'other'].includes(analysis.category) ? analysis.category : 'personal',
        deadline: this.parseDate(analysis.deadline),
        estimatedTime: analysis.estimatedTime || null,
        suggestions: analysis.suggestions || 'Break this task into smaller steps for easier completion.'
      }

      return result

    } catch (error) {
      console.error('Task analysis failed:', error.message)
      
      // Fallback analysis based on keywords
      return this.fallbackAnalysis(title, description)
    }
  }

  async generateTaskSummary(tasks) {
    if (!tasks || tasks.length === 0) {
      return {
        summary: "No tasks to analyze yet. Start creating tasks to get AI insights!",
        insights: []
      }
    }

    try {
      const taskSummary = this.prepareTasksForAnalysis(tasks)
      
      const prompt = `Analyze these recent tasks and provide insights in JSON format:

${taskSummary}

Generate a JSON response with:
{
  "summary": "A friendly 2-3 sentence summary of the user's recent productivity and task patterns",
  "insights": ["insight 1", "insight 2", "insight 3"]
}

The summary should be encouraging and highlight patterns. Insights should be specific, actionable tips based on the task data. Focus on:
- Productivity patterns
- Category distribution
- Completion rates
- Time management suggestions
- Priority patterns

Keep the tone supportive and motivational.`

      const messages = [
        {
          role: 'system',
          content: 'You are a productivity coach AI that provides encouraging insights about task management patterns. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]

      const analysis = await this.makeAPICall(messages, 600)

      return {
        summary: analysis.summary || 'You\'re making great progress on your tasks! Keep up the excellent work.',
        insights: Array.isArray(analysis.insights) ? analysis.insights.slice(0, 5) : [
          'Try grouping similar tasks together for better efficiency',
          'Consider setting specific time blocks for different task categories',
          'Regular breaks between tasks can boost your productivity'
        ]
      }

    } catch (error) {
      console.error('Summary generation failed:', error.message)
      return this.fallbackSummary(tasks)
    }
  }

  async generateTaskSuggestions(userContext) {
    try {
      const prompt = `Based on this user's task patterns, suggest 5 useful tasks they might want to add:

User Context:
- Recent categories: ${userContext.categories?.join(', ') || 'general'}
- Common priorities: ${userContext.priorities?.join(', ') || 'medium'}
- Activity level: ${userContext.activityLevel || 'moderate'}

Provide suggestions in JSON format:
{
  "suggestions": [
    {
      "title": "suggested task title",
      "category": "category",
      "priority": "priority",
      "reason": "why this task would be helpful"
    }
  ]
}

Make suggestions practical and relevant to their patterns.`

      const messages = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that suggests relevant tasks based on user patterns. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]

      const analysis = await this.makeAPICall(messages, 500)
      return analysis.suggestions || []

    } catch (error) {
      console.error('Task suggestions failed:', error.message)
      return this.fallbackSuggestions()
    }
  }

  async chatWithTasks(userMessage, userTasks) {
    try {
      const taskContext = this.prepareTasksForAnalysis(userTasks.slice(0, 10)) // Limit for API
      
      const prompt = `The user is asking about their tasks. Here's their recent task data:

${taskContext}

User question: "${userMessage}"

Provide a helpful, friendly response about their tasks. Be specific and reference actual task data when relevant. If they're asking for advice, provide actionable suggestions.

Respond in JSON format:
{
  "response": "your helpful response to the user"
}

Keep responses conversational and supportive.`

      const messages = [
        {
          role: 'system',
          content: 'You are a helpful AI task management assistant. You can answer questions about the user\'s tasks and provide productivity advice. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]

      const analysis = await this.makeAPICall(messages, 400)
      return analysis.response || "I'm here to help with your tasks! Feel free to ask me anything about your productivity."

    } catch (error) {
      console.error('Task chat failed:', error.message)
      return "I'm having trouble accessing AI features right now, but I'm still here to help organize your tasks!"
    }
  }

  // Helper methods
  prepareTasksForAnalysis(tasks) {
    return tasks.map((task, index) => {
      return `${index + 1}. "${task.title}" - Category: ${task.category}, Priority: ${task.priority}, Status: ${task.status}${
        task.dueDate ? `, Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''
      }`
    }).join('\n')
  }

  parseDate(dateString) {
    if (!dateString) return null
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return null
      
      // Ensure date is not in the past (except for today)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (date >= today) {
        return date.toISOString().split('T')[0]
      }
      return null
    } catch {
      return null
    }
  }

  fallbackAnalysis(title, description) {
    const titleLower = title.toLowerCase()
    const descLower = (description || '').toLowerCase()
    const fullText = `${titleLower} ${descLower}`

    // Priority detection
    let priority = 'medium'
    if (fullText.includes('urgent') || fullText.includes('asap') || fullText.includes('important') || 
        fullText.includes('critical') || fullText.includes('deadline')) {
      priority = 'high'
    } else if (fullText.includes('low priority') || fullText.includes('someday') || 
               fullText.includes('maybe') || fullText.includes('when free')) {
      priority = 'low'
    }

    // Category detection
    let category = 'personal'
    if (fullText.includes('work') || fullText.includes('meeting') || fullText.includes('project') ||
        fullText.includes('client') || fullText.includes('email')) {
      category = 'work'
    } else if (fullText.includes('study') || fullText.includes('learn') || fullText.includes('course') ||
               fullText.includes('homework') || fullText.includes('assignment')) {
      category = 'study'
    } else if (fullText.includes('exercise') || fullText.includes('health') || fullText.includes('doctor') ||
               fullText.includes('gym') || fullText.includes('workout')) {
      category = 'health'
    }

    // Simple deadline detection
    let deadline = null
    const today = new Date()
    if (fullText.includes('today')) {
      deadline = today.toISOString().split('T')[0]
    } else if (fullText.includes('tomorrow')) {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      deadline = tomorrow.toISOString().split('T')[0]
    } else if (fullText.includes('friday')) {
      const friday = this.getNextFriday()
      deadline = friday.toISOString().split('T')[0]
    }

    return {
      priority,
      category,
      deadline,
      estimatedTime: this.estimateTaskTime(fullText),
      suggestions: this.generateFallbackSuggestion(category, priority)
    }
  }

  fallbackSummary(tasks) {
    const completed = tasks.filter(t => t.status === 'completed').length
    const total = tasks.length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    const categories = [...new Set(tasks.map(t => t.category))]
    const mostCommonCategory = this.getMostFrequent(tasks.map(t => t.category))

    return {
      summary: `You've completed ${completed} out of ${total} recent tasks (${completionRate}% completion rate). ${
        mostCommonCategory ? `Most of your tasks are ${mostCommonCategory}-related.` : 'Keep up the great work!'
      } Your productivity is on track!`,
      insights: [
        `${completionRate >= 70 ? 'Excellent' : completionRate >= 50 ? 'Good' : 'Keep pushing'} completion rate of ${completionRate}%`,
        `Focus areas: ${categories.slice(0, 3).join(', ')}`,
        'Consider breaking larger tasks into smaller, manageable steps'
      ]
    }
  }

  fallbackSuggestions() {
    return [
      {
        title: "Review and organize today's priorities",
        category: "personal",
        priority: "medium",
        reason: "Daily planning helps maintain focus"
      },
      {
        title: "Check and respond to important emails",
        category: "work",
        priority: "medium",
        reason: "Stay on top of communication"
      },
      {
        title: "Take a 15-minute walk or stretch break",
        category: "health",
        priority: "low",
        reason: "Regular breaks boost productivity"
      }
    ]
  }

  estimateTaskTime(text) {
    if (text.includes('quick') || text.includes('brief')) return '15 minutes'
    if (text.includes('meeting') || text.includes('call')) return '1 hour'
    if (text.includes('project') || text.includes('assignment')) return '2-3 hours'
    if (text.includes('research') || text.includes('study')) return '1-2 hours'
    return '30 minutes'
  }

  generateFallbackSuggestion(category, priority) {
    const suggestions = {
      work: 'Consider scheduling this during your most productive hours for best results.',
      personal: 'Break this into smaller steps if it feels overwhelming.',
      study: 'Set a timer and take breaks every 25 minutes (Pomodoro technique).',
      health: 'Consistency is key - even small daily actions make a big difference.',
      other: 'Add specific details and deadlines to make this task more actionable.'
    }

    return suggestions[category] || 'Focus on one step at a time to make steady progress.'
  }

  getNextFriday() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7
    const friday = new Date(today)
    friday.setDate(today.getDate() + daysUntilFriday)
    return friday
  }

  getMostFrequent(arr) {
    const frequency = {}
    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1
    })
    
    return Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b
    )
  }
}

module.exports = new AIService()