const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
  }

  // step 1 — extract unique dates (ignore time, just YYYY-MM-DD)
  const uniqueDatesSet = new Set(
    sessions.map((s) => {
      const d = new Date(s.date)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  )

  // step 2 — convert to sorted array of Date objects (ascending)
  const sortedDates = Array.from(uniqueDatesSet)
    .map((str) => {
      const [y, m, d] = str.split('-').map(Number)
      const date = new Date(y, m, d)
      date.setHours(0, 0, 0, 0)
      return date
    })
    .sort((a, b) => a - b)

  // step 3 — calculate longest streak by walking through sorted dates
  let longestStreak = 1
  let tempStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24)

    if (diff === 1) {
      // consecutive day
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else if (diff > 1) {
      // gap found — reset temp streak
      tempStreak = 1
    }
    // diff === 0 means same day (shouldn't happen since we deduped, but safe to ignore)
  }

  // step 4 — calculate current streak (working backwards from today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const lastDate = sortedDates[sortedDates.length - 1]
  const lastActiveDate = lastDate

  // if last session wasn't today or yesterday, streak is broken
  const lastDiff = (today - lastDate) / (1000 * 60 * 60 * 24)
  if (lastDiff > 1) {
    return { currentStreak: 0, longestStreak, lastActiveDate }
  }

  // count backwards from last date
  let currentStreak = 1
  for (let i = sortedDates.length - 2; i >= 0; i--) {
    const diff = (sortedDates[i + 1] - sortedDates[i]) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      currentStreak++
    } else {
      break
    }
  }

  return { currentStreak, longestStreak, lastActiveDate }
}

module.exports = calculateStreak