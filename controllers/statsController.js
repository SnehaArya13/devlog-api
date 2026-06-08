const Session = require('../models/Session')

// WEEKLY STATS
const getWeeklyStats = async (req, res) => {
  try {
    const weekStart = new Date()
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // start of week (Sunday)

    const weekEnd = new Date()
    weekEnd.setHours(23, 59, 59, 999)

    // pipeline 1 — overall weekly numbers
    const overallStats = await Session.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: weekStart, $lte: weekEnd }
        }
      },
      {
        $group: {
          _id: null,                                    // group everything together
          totalMinutes: { $sum: '$durationMinutes' },
          totalSessions: { $sum: 1 },
          avgDurationMinutes: { $avg: '$durationMinutes' }
        }
      }
    ])

    // pipeline 2 — breakdown by topic
    const topicBreakdown = await Session.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: weekStart, $lte: weekEnd }
        }
      },
      {
        $group: {
          _id: '$topic',                                // group by topic
          totalMinutes: { $sum: '$durationMinutes' },
          sessionCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalMinutes: -1 }                    // most studied topic first
      },
      {
        $project: {
          topic: '$_id',
          totalMinutes: 1,
          sessionCount: 1,
          _id: 0                                        // remove _id from output
        }
      }
    ])

    // pipeline 3 — breakdown by difficulty
    const difficultyBreakdown = await Session.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: weekStart, $lte: weekEnd }
        }
      },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          difficulty: '$_id',
          count: 1,
          _id: 0
        }
      }
    ])

    const stats = overallStats[0] || {
      totalMinutes: 0,
      totalSessions: 0,
      avgDurationMinutes: 0
    }

    res.status(200).json({
      success: true,
      week: {
        from: weekStart,
        to: weekEnd
      },
      stats: {
        totalMinutes: Math.round(stats.totalMinutes),
        totalHours: +(stats.totalMinutes / 60).toFixed(1),
        totalSessions: stats.totalSessions,
        avgSessionMinutes: Math.round(stats.avgDurationMinutes || 0),
        topicBreakdown,
        difficultyBreakdown
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// ALL-TIME SUMMARY
const getSummary = async (req, res) => {
  try {
    const overallStats = await Session.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: '$durationMinutes' },
          totalSessions: { $sum: 1 },
          avgDurationMinutes: { $avg: '$durationMinutes' }
        }
      }
    ])

    // most studied topic all time
    const topicBreakdown = await Session.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$topic',
          totalMinutes: { $sum: '$durationMinutes' },
          sessionCount: { $sum: 1 }
        }
      },
      { $sort: { totalMinutes: -1 } },
      {
        $project: {
          topic: '$_id',
          totalMinutes: 1,
          sessionCount: 1,
          _id: 0
        }
      }
    ])

    // difficulty distribution all time
    const difficultyBreakdown = await Session.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          difficulty: '$_id',
          count: 1,
          _id: 0
        }
      }
    ])

    const stats = overallStats[0] || {
      totalMinutes: 0,
      totalSessions: 0,
      avgDurationMinutes: 0
    }

    res.status(200).json({
      success: true,
      allTime: {
        totalMinutes: Math.round(stats.totalMinutes),
        totalHours: +(stats.totalMinutes / 60).toFixed(1),
        totalSessions: stats.totalSessions,
        avgSessionMinutes: Math.round(stats.avgDurationMinutes || 0),
        mostStudiedTopic: topicBreakdown[0]?.topic || 'None yet',
        topicBreakdown,
        difficultyBreakdown
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// DAILY STATS
const getDailyStats = async (req, res) => {
  try {
    const { date } = req.query

    const targetDate = date ? new Date(date) : new Date()
    const dayStart = new Date(targetDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(targetDate)
    dayEnd.setHours(23, 59, 59, 999)

    const sessions = await Session.find({
      userId: req.user._id,
      date: { $gte: dayStart, $lte: dayEnd }
    }).sort({ date: 1 })

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)

    const topicBreakdown = sessions.reduce((acc, s) => {
      acc[s.topic] = (acc[s.topic] || 0) + s.durationMinutes
      return acc
    }, {})

    res.status(200).json({
      success: true,
      date: dayStart,
      stats: {
        totalMinutes,
        totalHours: +(totalMinutes / 60).toFixed(1),
        totalSessions: sessions.length,
        topicBreakdown,
        sessions
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { getWeeklyStats, getSummary, getDailyStats }