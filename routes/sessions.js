const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession
} = require('../controllers/sessionController')

// all routes here are protected
router.use(protect)

router.post('/', createSession)
router.get('/', getSessions)
router.get('/:id', getSessionById)
router.put('/:id', updateSession)
router.delete('/:id', deleteSession)

module.exports = router