const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');
const { isAuthenticated } = require('../middleware/auth');

/**
 * POST /api/v1/activity
 * Record user activity
 */
router.post('/', isAuthenticated, (req, res) => {
  try {
    const { kind, targetType, targetId, valueInt } = req.body;
    const userId = req.user.id;

    if (!kind) {
      return res.status(400).json({
        data: null,
        error: 'kind is required'
      });
    }

    run(
      'INSERT INTO activity (user_id, kind, target_type, target_id, value_int) VALUES (?, ?, ?, ?, ?)',
      [userId, kind, targetType || null, targetId || null, valueInt || null]
    );

    res.json({
      data: { success: true },
      error: null
    });
  } catch (error) {
    console.error('Activity error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to record activity'
    });
  }
});

/**
 * GET /api/v1/dashboard/me
 * Get dashboard stats for current user
 */
router.get('/dashboard/me', isAuthenticated, (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Time spent today (sum of TIME_TICK value_int)
    const timeToday = get(
      `SELECT COALESCE(SUM(value_int), 0) as total 
       FROM activity 
       WHERE user_id = ? AND kind = 'TIME_TICK' AND created_at >= ?`,
      [userId, todayStart]
    );

    // Time spent this week
    const timeWeek = get(
      `SELECT COALESCE(SUM(value_int), 0) as total 
       FROM activity 
       WHERE user_id = ? AND kind = 'TIME_TICK' AND created_at >= ?`,
      [userId, weekStart]
    );

    // Lessons viewed (count distinct lesson PAGE_VIEW)
    const lessonsViewed = get(
      `SELECT COUNT(DISTINCT target_id) as count 
       FROM activity 
       WHERE user_id = ? AND kind = 'PAGE_VIEW' AND target_type = 'lesson'`,
      [userId]
    );

    // Exercises opened
    const exercisesOpened = get(
      `SELECT COUNT(DISTINCT target_id) as count 
       FROM activity 
       WHERE user_id = ? AND kind = 'EXERCISE_OPEN'`,
      [userId]
    );

    res.json({
      data: {
        timeToday: timeToday.total,
        timeWeek: timeWeek.total,
        lessonsViewed: lessonsViewed.count,
        exercisesOpened: exercisesOpened.count
      },
      error: null
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to fetch dashboard data'
    });
  }
});

module.exports = router;
