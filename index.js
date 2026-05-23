require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/Users')

const app = express()

// Middleware
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully')

    const testUser = await User.create({
      name: 'Sneha Test',
      email: 'sneha@test.com',
      password: '123456'
    })
    console.log('✅ Test user created:', testUser._id)
  })
  .catch((err) => console.log('❌ MongoDB connection error:', err))

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'DevLog API is running' })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})