const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { all, get, run } = require('../db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Configure multer for exercise file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'exercises');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * GET /api/v1/lessons/:slug
 * Get lesson detail with sessions and exercises
 */
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    const lesson = get(
      `SELECT 
        l.id,
        l.title,
        l.slug,
        l.summary,
        l.score,
        s.name as subject_name,
        s.slug as subject_slug
      FROM lessons l
      JOIN subjects s ON l.subject_id = s.id
      WHERE l.slug = ?`,
      [slug]
    );

    if (!lesson) {
      return res.status(404).json({
        data: null,
        error: 'Lesson not found'
      });
    }

    const sessions = all(
      'SELECT id, title, video_url, duration_seconds, score FROM recorded_sessions WHERE lesson_id = ?',
      [lesson.id]
    );

    const exercises = all(
      `SELECT 
        id, 
        title, 
        description, 
        difficulty, 
        score,
        file_path as file_url
      FROM exercises 
      WHERE lesson_id = ?`,
      [lesson.id]
    );

    res.json({
      data: {
        ...lesson,
        sessions,
        exercises
      },
      error: null
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to fetch lesson'
    });
  }
});

/**
 * POST /api/v1/lessons/:slug/sessions
 * Create a new recorded session (Admin only)
 */
router.post('/:slug/sessions', isAuthenticated, isAdmin, (req, res) => {
  try {
    const { slug } = req.params;
    const { title, videoUrl, durationSeconds } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({
        data: null,
        error: 'Title and video URL are required'
      });
    }

    const lesson = get('SELECT id FROM lessons WHERE slug = ?', [slug]);
    if (!lesson) {
      return res.status(404).json({
        data: null,
        error: 'Lesson not found'
      });
    }

    const result = run(
      'INSERT INTO recorded_sessions (lesson_id, title, video_url, duration_seconds, score) VALUES (?, ?, ?, ?, ?)',
      [lesson.id, title, videoUrl, durationSeconds || null, 0]
    );

    res.status(201).json({
      data: {
        id: result.lastInsertRowid,
        title,
        videoUrl,
        durationSeconds
      },
      error: null
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to create session'
    });
  }
});

/**
 * POST /api/v1/lessons/:slug/exercises
 * Create a new exercise (Admin only)
 */
router.post('/:slug/exercises', isAuthenticated, isAdmin, upload.single('file'), (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, difficulty } = req.body;

    if (!title) {
      return res.status(400).json({
        data: null,
        error: 'Title is required'
      });
    }

    const lesson = get('SELECT id FROM lessons WHERE slug = ?', [slug]);
    if (!lesson) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        data: null,
        error: 'Lesson not found'
      });
    }

    const filePath = req.file ? req.file.filename : null;

    const result = run(
      'INSERT INTO exercises (lesson_id, title, description, file_path, difficulty, score) VALUES (?, ?, ?, ?, ?, ?)',
      [lesson.id, title, description || null, filePath, difficulty || 'MEDIUM', 0]
    );

    res.status(201).json({
      data: {
        id: result.lastInsertRowid,
        title,
        description,
        difficulty: difficulty || 'MEDIUM',
        fileUrl: filePath ? '/uploads/exercises/' + filePath : null
      },
      error: null
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to create exercise'
    });
  }
});

module.exports = router;
