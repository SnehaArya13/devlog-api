const Goal = require('../models/Goal')
const Session = require('../models/Session')

// CREATE or SET a goal
const setGoal = async (req, res, next) => {
  try {
    const { dailyTargetMinutes } = req.body

    if (!dailyTargetMinutes) {
      return res.status(400).json({ message: 'dailyTargetMinutes is required' })
    }

    // check if user already has a goal
    const existingGoal = await Goal.findOne({ userId: req.user._id })

    if (existingGoal) {
      return res.status(400).json({
        message: 'You already have a goal. Use PUT /api/goals to update it.'
      })
    }

    const goal = await Goal.create({
      userId: req.user._id,
      dailyTargetMinutes
    })

    res.status(201).json({ success: true, goal })

  } catch (err) {
    next(err)
  }
}

// GET current goal + today's progress
const getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ userId: req.user._id })

    if (!goal) {
      return res.status(404).json({ message: 'No goal set yet. Use POST /api/goals to set one.' })
    }

    // calculate today's total logged minutes
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const todaySessions = await Session.find({
      userId: req.user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    })

    const todayMinutes = todaySessions.reduce((total, s) => total + s.durationMinutes, 0)
    const goalMet = todayMinutes >= goal.dailyTargetMinutes
    const remaining = Math.max(0, goal.dailyTargetMinutes - todayMinutes)

    res.status(200).json({
      success: true,
      goal,
      today: {
        minutesLogged: todayMinutes,
        targetMinutes: goal.dailyTargetMinutes,
        remaining,
        goalMet,
        progressPercent: Math.min(100, Math.round((todayMinutes / goal.dailyTargetMinutes) * 100))
      }
    })

  } catch (err) {
    next(err)
  }
}

// UPDATE goal
const updateGoal = async (req, res, next) => {
  try {
    const { dailyTargetMinutes } = req.body

    if (!dailyTargetMinutes) {
      return res.status(400).json({ message: 'dailyTargetMinutes is required' })
    }

    const goal = await Goal.findOneAndUpdate(
      { userId: req.user._id },
      { dailyTargetMinutes },
      { new: true, runValidators: true }
    )

    if (!goal) {
      return res.status(404).json({ message: 'No goal found. Use POST /api/goals to create one.' })
    }

    res.status(200).json({ success: true, goal })

  } catch (err) {
    next(err)
  }
}

module.exports = { setGoal, getGoal, updateGoal }