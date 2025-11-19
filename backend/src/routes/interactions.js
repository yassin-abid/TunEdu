const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db');
const { isAuthenticated } = require('../middleware/auth');

/**
 * POST /api/v1/vote
 * Create or update a vote
 */
router.post('/vote', isAuthenticated, (req, res) => {
  try {
    const { targetType, targetId, value } = req.body;
    const userId = req.user.id;

    if (!targetType || !targetId || !value) {
      return res.status(400).json({
        data: null,
        error: 'targetType, targetId, and value are required'
      });
    }

    if (value !== 1 && value !== -1) {
      return res.status(400).json({
        data: null,
        error: 'value must be 1 or -1'
      });
    }

    // Check if vote exists
    const existingVote = get(
      'SELECT id, value FROM votes WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [userId, targetType, targetId]
    );

    if (existingVote) {
      // Update existing vote
      const oldValue = existingVote.value;
      run(
        'UPDATE votes SET value = ? WHERE id = ?',
        [value, existingVote.id]
      );
      
      // Update score on target
      const scoreDelta = value - oldValue;
      updateTargetScore(targetType, targetId, scoreDelta);
    } else {
      // Create new vote
      run(
        'INSERT INTO votes (user_id, target_type, target_id, value) VALUES (?, ?, ?, ?)',
        [userId, targetType, targetId, value]
      );
      
      // Update score on target
      updateTargetScore(targetType, targetId, value);
    }

    res.json({
      data: { success: true },
      error: null
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to record vote'
    });
  }
});

/**
 * Helper function to update score on target entity
 */
function updateTargetScore(targetType, targetId, delta) {
  let table;
  switch (targetType) {
    case 'lesson':
      table = 'lessons';
      break;
    case 'session':
      table = 'recorded_sessions';
      break;
    case 'exercise':
      table = 'exercises';
      break;
    default:
      return;
  }
  
  run(`UPDATE ${table} SET score = score + ? WHERE id = ?`, [delta, targetId]);
}

/**
 * GET /api/v1/comments
 * Get comments for a target
 */
router.get('/comments', (req, res) => {
  try {
    const { targetType, targetId } = req.query;

    if (!targetType || !targetId) {
      return res.status(400).json({
        data: null,
        error: 'targetType and targetId are required'
      });
    }

    const comments = all(
      `SELECT 
        c.id,
        c.body,
        c.parent_id,
        c.created_at,
        u.id as user_id,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.target_type = ? AND c.target_id = ?
      ORDER BY c.created_at DESC`,
      [targetType, targetId]
    );

    res.json({
      data: comments,
      error: null
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to fetch comments'
    });
  }
});

/**
 * POST /api/v1/comments
 * Create a comment
 */
router.post('/comments', isAuthenticated, (req, res) => {
  try {
    const { targetType, targetId, body, parentId } = req.body;
    const userId = req.user.id;

    if (!targetType || !targetId || !body) {
      return res.status(400).json({
        data: null,
        error: 'targetType, targetId, and body are required'
      });
    }

    const result = run(
      'INSERT INTO comments (user_id, target_type, target_id, body, parent_id) VALUES (?, ?, ?, ?, ?)',
      [userId, targetType, targetId, body, parentId || null]
    );

    const comment = get(
      `SELECT 
        c.id,
        c.body,
        c.parent_id,
        c.created_at,
        u.id as user_id,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?`,
      [result.lastInsertRowid]
    );

    res.status(201).json({
      data: comment,
      error: null
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to create comment'
    });
  }
});

/**
 * DELETE /api/v1/comments/:id
 * Delete a comment (author or admin only)
 */
router.delete('/comments/:id', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = get('SELECT user_id FROM comments WHERE id = ?', [id]);
    if (!comment) {
      return res.status(404).json({
        data: null,
        error: 'Comment not found'
      });
    }

    // Check if user is author or admin
    if (comment.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        data: null,
        error: 'Not authorized to delete this comment'
      });
    }

    run('DELETE FROM comments WHERE id = ?', [id]);

    res.json({
      data: { success: true },
      error: null
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to delete comment'
    });
  }
});

module.exports = router;
