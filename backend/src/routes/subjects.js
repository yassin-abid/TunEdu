const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { all, get, run } = require('../db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and image files are allowed'));
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

/**
 * GET /api/v1/subjects/:slug
 * Get subject detail with lessons
 */
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    const subject = get(
      `SELECT 
        s.id, 
        s.name, 
        s.slug, 
        s.description,
        s.manual_path,
        s.thumbnail_url,
        s.manual_path as manual_url,
        cy.name as class_year_name,
        cy.slug as class_year_slug,
        l.name as level_name,
        l.slug as level_slug
      FROM subjects s
      JOIN class_years cy ON s.class_year_id = cy.id
      JOIN levels l ON cy.level_id = l.id
      WHERE s.slug = ?`,
      [slug]
    );

    if (!subject) {
      return res.status(404).json({
        data: null,
        error: 'Subject not found'
      });
    }

    const lessons = all(
      `SELECT id, title, slug, summary, "order", score 
       FROM lessons 
       WHERE subject_id = ? 
       ORDER BY "order"`,
      [subject.id]
    );

    res.json({
      data: {
        ...subject,
        lessons
      },
      error: null
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to fetch subject'
    });
  }
});

/**
 * POST /api/v1/subjects/:slug/lessons
 * Create a new lesson (Admin only)
 */
router.post('/:slug/lessons', isAuthenticated, isAdmin, (req, res) => {
  try {
    const { slug } = req.params;
    const { title, summary, order } = req.body;

    if (!title) {
      return res.status(400).json({
        data: null,
        error: 'Title is required'
      });
    }

    const subject = get('SELECT id FROM subjects WHERE slug = ?', [slug]);
    if (!subject) {
      return res.status(404).json({
        data: null,
        error: 'Subject not found'
      });
    }

    // Generate slug from title
    const lessonSlug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const result = run(
      'INSERT INTO lessons (subject_id, title, slug, summary, "order", score) VALUES (?, ?, ?, ?, ?, ?)',
      [subject.id, title, lessonSlug + '-' + Date.now(), summary || null, order || 0, 0]
    );

    res.status(201).json({
      data: {
        id: result.lastInsertRowid,
        title,
        slug: lessonSlug + '-' + Date.now(),
        summary,
        order: order || 0
      },
      error: null
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to create lesson'
    });
  }
});

/**
 * POST /api/v1/subjects/:slug/manual
 * Upload manual PDF (Admin only)
 */
router.post('/:slug/manual', isAuthenticated, isAdmin, upload.single('manual'), (req, res) => {
  try {
    const { slug } = req.params;

    if (!req.file) {
      return res.status(400).json({
        data: null,
        error: 'No file uploaded'
      });
    }

    const subject = get('SELECT id FROM subjects WHERE slug = ?', [slug]);
    if (!subject) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        data: null,
        error: 'Subject not found'
      });
    }

    run(
      'UPDATE subjects SET manual_path = ? WHERE id = ?',
      [req.file.filename, subject.id]
    );

    res.json({
      data: {
        manual_url: '/uploads/' + req.file.filename
      },
      error: null
    });
  } catch (error) {
    console.error('Upload manual error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to upload manual'
    });
  }
});

module.exports = router;
