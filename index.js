const express = require('express')
const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// Route 1 — basic hello
app.get('/', (req, res) => {
  res.json({ message: 'DevLog API is running' })
})

// Route 2 — hello with a name from URL
app.get('/hello/:name', (req, res) => {
  const { name } = req.params
  res.json({ message: `Hello, ${name}!` })
})

// Route 3 — echo back whatever JSON you send
app.post('/echo', (req, res) => {
  const body = req.body
  res.json({ youSent: body })
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})