const Session = require('../models/Session')

// CREATE a session
const createSession = async (req, res, next) => {
  try {
    const { topic, durationMinutes, difficulty, notes, date } = req.body

    // validate required fields
    if (!topic || !durationMinutes || !difficulty) {
      return res.status(400).json({ message: 'Topic, duration and difficulty are required' })
    }

    const session = await Session.create({
      userId: req.user._id,   // comes from protect middleware
      topic,
      durationMinutes,
      difficulty,
      notes,
      date: date || Date.now()
    })

    res.status(201).json({
      success: true,
      session
    })

  } catch (err) {
    next(err)
  }
}

// GET all sessions for logged-in user
const getSessions = async (req, res, next) => {
  try {
    const { topic, date } = req.query

    // build filter object dynamically
    const filter = { userId: req.user._id }

    if (topic) {
      filter.topic = { $regex: topic, $options: 'i' } // case-insensitive search
    }

    if (date) {
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)
      filter.date = { $gte: start, $lte: end }
    }

    const sessions = await Session.find(filter).sort({ date: -1 }) // newest first

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    })

  } catch (err) {
    next(err)
  }
}

// GET single session by ID
const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // make sure this session belongs to the logged-in user
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this session' })
    }

    res.status(200).json({ success: true, session })

  } catch (err) {
    next(err)
  }
}

// UPDATE a session
const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // make sure this session belongs to the logged-in user
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this session' })
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true returns updated doc
    )

    res.status(200).json({ success: true, session: updatedSession })

  } catch (err) {
    next(err)
  }
}

// DELETE a session
const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // make sure this session belongs to the logged-in user
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this session' })
    }

    await Session.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, message: 'Session deleted' })

  } catch (err) {
    next(err)
  }
}

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession
}