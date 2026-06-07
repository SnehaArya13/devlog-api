const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const { getStreaks } = require('../controllers/streakController')

router.use(protect)

router.get('/', getStreaks)

module.exports = router