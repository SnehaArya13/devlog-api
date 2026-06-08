const Session = require('../models/Session')
const calculateStreak = require('../utils/calculateStreak')

const getStreaks = async (req, res, next) => {
  try {
    // get all sessions for this user, only need the date field
    const sessions = await Session.find(
      { userId: req.user._id },
      { date: 1 }        // projection — only fetch date field, not entire document
    ).sort({ date: 1 })

    const { currentStreak, longestStreak, lastActiveDate } = calculateStreak(sessions)

    // check if user logged anything today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const loggedToday = await Session.exists({
      userId: req.user._id,
      date: { $gte: today, $lte: todayEnd }
    })

    res.status(200).json({
      success: true,
      streaks: {
        currentStreak,
        longestStreak,
        lastActiveDate,
        loggedToday: !!loggedToday,
        message: currentStreak === 0
          ? 'No active streak. Log a session today to start one!'
          : `You're on a ${currentStreak}-day streak. Keep it going!`
      }
    })

  } catch (err) {
  next(err)
  }
}

module.exports = { getStreaks }