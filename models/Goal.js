const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dailyTargetMinutes: {
    type: Number,
    required: true,
    min: [1, 'Target must be at least 1 minute']
  }
}, { timestamps: true })

module.exports = mongoose.model('Goal', goalSchema)