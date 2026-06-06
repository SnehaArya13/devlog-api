const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const { setGoal, getGoal, updateGoal } = require('../controllers/goalController')

router.use(protect)

router.post('/', setGoal)
router.get('/', getGoal)
router.put('/', updateGoal)

module.exports = router