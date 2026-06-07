require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const sessionRoutes = require('./routes/sessions')
const goalRoutes = require('./routes/goals')
const streakRoutes = require('./routes/streaks')

const protect = require('./middleware/protect')

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err))

app.get('/', (req, res) => {
  res.json({ message: 'DevLog API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/streaks', streakRoutes)

// Test protected route
app.get('/api/me', protect, (req, res) => {
  res.json({ user: req.user })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})