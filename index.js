require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const authRoutes = require('./routes/auth')
const sessionRoutes = require('./routes/sessions')
const goalRoutes = require('./routes/goals')
const streakRoutes = require('./routes/streaks')
const statsRoutes = require('./routes/stats')

const protect = require('./middleware/protect')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// ── Security & logging middleware ──────────────────────────
app.use(helmet())                    // sets secure HTTP headers
app.use(cors())                      // allows React frontend to call this API
app.use(morgan('dev'))               // logs every request in terminal
app.use(express.json())              // parse JSON bodies

// ── Database ───────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.log('❌ MongoDB connection error:', err))

// ── Routes ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'DevLog API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      sessions: '/api/sessions',
      goals: '/api/goals',
      streaks: '/api/streaks',
      stats: '/api/stats'
    }
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/streaks', streakRoutes)
app.use('/api/stats', statsRoutes)

app.get('/api/me', protect, (req, res) => {
  res.json({ success: true, user: req.user })
})

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  })
})

// ── Centralized error handler (must be last) ───────────────
app.use(errorHandler)

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})