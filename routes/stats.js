const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const { getWeeklyStats, getSummary, getDailyStats } = require('../controllers/statsController')

router.use(protect)

router.get('/weekly', getWeeklyStats)
router.get('/summary', getSummary)
router.get('/daily', getDailyStats)

module.exports = router