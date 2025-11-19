const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, '../../uploads');
const exercisesDir = path.join(uploadsDir, 'exercises');
const manualsDir = path.join(uploadsDir, 'manuals');

[uploadsDir, exercisesDir, manualsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.path.includes('exercise')) {
      cb(null, exercisesDir);
    } else if (req.path.includes('manual')) {
      cb(null, manualsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// All routes require authentication and admin role
router.use(isAuthenticated);
router.use(isAdmin);

// Create a subject
router.post('/subjects', (req, res) => {
  try {
    const { class_year_id, name, description } = req.body;

    if (!class_year_id || !name) {
      return res.status(400).json({ error: 'class_year_id and name are required' });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const result = db.run(
      `INSERT INTO subjects (class_year_id, name, slug, description)
       VALUES (?, ?, ?, ?)`,
      [class_year_id, name, slug, description || '']
    );

    res.json({
      data: {
        id: result.lastInsertRowid,
        class_year_id,
        name,
        slug,
        description
      },
      error: null
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a lesson
router.post('/lessons', (req, res) => {
  try {
    const { subject_id, title, description } = req.body;

    if (!subject_id || !title) {
      return res.status(400).json({ error: 'subject_id and title are required' });
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Get the next order number for this subject
    const maxOrder = db.get(
      'SELECT MAX("order") as max_order FROM lessons WHERE subject_id = ?',
      [subject_id]
    );
    const order = (maxOrder?.max_order || 0) + 1;

    const result = db.run(
      `INSERT INTO lessons (subject_id, title, slug, summary, "order", score)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [subject_id, title, slug, description || '', order]
    );

    res.json({
      data: {
        id: result.lastInsertRowid,
        subject_id,
        title,
        slug,
        summary: description || '',
        order
      },
      error: null
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a recorded session (video)
router.post('/sessions', (req, res) => {
  try {
    const { lesson_id, title, video_url, duration_minutes } = req.body;

    if (!lesson_id || !title || !video_url) {
      return res.status(400).json({ error: 'lesson_id, title, and video_url are required' });
    }

    // Convert minutes to seconds if provided
    const duration_seconds = duration_minutes ? duration_minutes * 60 : null;

    const result = db.run(
      `INSERT INTO recorded_sessions (lesson_id, title, video_url, duration_seconds, score)
       VALUES (?, ?, ?, ?, 0)`,
      [lesson_id, title, video_url, duration_seconds]
    );

    res.json({
      data: {
        id: result.lastInsertRowid,
        lesson_id,
        title,
        video_url,
        duration_seconds
      },
      error: null
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add an exercise with PDF
router.post('/exercises', upload.single('file'), (req, res) => {
  try {
    const { lesson_id, title, description, difficulty } = req.body;

    if (!lesson_id || !title || !req.file) {
      return res.status(400).json({ error: 'lesson_id, title, and file are required' });
    }

    const filePath = `/uploads/exercises/${req.file.filename}`;

    // Map French difficulty to database values (EASY, MEDIUM, HARD)
    const difficultyMap = {
      'facile': 'EASY',
      'moyen': 'MEDIUM',
      'difficile': 'HARD'
    };
    const dbDifficulty = difficultyMap[difficulty?.toLowerCase()] || 'MEDIUM';

    const result = db.run(
      `INSERT INTO exercises (lesson_id, title, description, difficulty, file_path, score)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [lesson_id, title, description || '', dbDifficulty, filePath]
    );

    res.json({
      data: {
        id: result.lastInsertRowid,
        lesson_id,
        title,
        description,
        difficulty: dbDifficulty,
        file_path: filePath
      },
      error: null
    });
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload manual for a subject
router.post('/manuals', upload.single('file'), (req, res) => {
  try {
    const { subject_id } = req.body;

    if (!subject_id || !req.file) {
      return res.status(400).json({ error: 'subject_id and file are required' });
    }

    const filePath = `/uploads/manuals/${req.file.filename}`;

    db.run(
      `UPDATE subjects SET manual_path = ? WHERE id = ?`,
      [filePath, subject_id]
    );

    res.json({
      data: {
        subject_id,
        manual_path: filePath
      },
      error: null
    });
  } catch (error) {
    console.error('Error uploading manual:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all subjects (for dropdowns)
router.get('/subjects', (req, res) => {
  try {
    const subjects = db.all(`
      SELECT s.*, cy.name as year_name, l.name as level_name
      FROM subjects s
      JOIN class_years cy ON s.class_year_id = cy.id
      JOIN levels l ON cy.level_id = l.id
      ORDER BY l."order", cy."order", s.name
    `);

    res.json({ data: subjects, error: null });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all lessons with subject info (for dropdowns)
router.get('/lessons', (req, res) => {
  try {
    const lessons = db.all(`
      SELECT 
        l.id,
        l.title,
        l.slug,
        s.name as subject_name, 
        cy.name as year_name,
        lv.name as level_name,
        lv."order" as level_order,
        cy."order" as year_order
      FROM lessons l
      JOIN subjects s ON l.subject_id = s.id
      JOIN class_years cy ON s.class_year_id = cy.id
      JOIN levels lv ON cy.level_id = lv.id
      ORDER BY lv."order", cy."order", s.name, l.title
    `);

    res.json({ data: lessons, error: null });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
