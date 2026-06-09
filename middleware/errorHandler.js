const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages
    })
  }

  // Mongoose duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
  }

  // Mongoose bad ObjectId (e.g. /api/sessions/invalidid)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired, please login again'
    })
  }

  // default — generic server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
}

module.exports = errorHandler