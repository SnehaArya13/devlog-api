const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    // 1. get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, unauthorized' })
    }

    // 2. extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1]

    // 3. verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. find user from token's payload and attach to req
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user  // now every protected route has access to req.user
    next()

  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' })
  }
}

module.exports = protect