const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// helper — generates a JWT token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { userId },                          // payload — what's stored inside
    process.env.JWT_SECRET,              // secret key
    { expiresIn: process.env.JWT_EXPIRE } // expiry
  )
}

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    // 2. check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // 3. hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 4. create user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // 5. generate token
    const token = generateToken(user._id)

    // 6. return response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    // 2. find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // 3. compare password with hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // 4. generate token
    const token = generateToken(user._id)

    // 5. return response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { register, login }