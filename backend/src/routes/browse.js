const express = require('express');
const router = express.Router();
const { all, get } = require('../db');

/**
 * GET /api/v1/levels
 * Get all education levels with year count
 */
router.get('/levels', (req, res) => {
  try {
    const levels = all(`
      SELECT 
        l.id,
        l.name,
        l.slug,
        l."order",
        COUNT(cy.id) as year_count
      FROM levels l
      LEFT JOIN class_years cy ON cy.level_id = l.id
      GROUP BY l.id
      ORDER BY l."order"
    `);

    res.json({
      data: levels,
      error: null
    });
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to fetch levels'
    });
  }
});

/**
 * GET /api/v1/levels/:slug/years
 * Get all class years for a level
 */
router.get('/levels/:slug/years', (req, res) => {
  try {
    const { slug } = req.params;

    const level = get('SELECT id FROM levels WHERE slug = ?', [slug]);
    if (!level) {
      return res.status(404).json({
        data: null,
        error: 'Level not found'
      });
    }

    const years = all(
      'SELECT id, name, slug, "order" FROM class_years WHERE level_id = ? ORDER BY "order"',
      [level.id]
    );

    res.json({
      data: years,
      error: null
    });
  } catch (error) {
    console.error('Get years error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to fetch years'
    });
  }
});

/**
 * GET /api/v1/years/:slug/subjects
 * Get all subjects for a class year
 */
router.get('/years/:slug/subjects', (req, res) => {
  try {
    const { slug } = req.params;

    const year = get('SELECT id FROM class_years WHERE slug = ?', [slug]);
    if (!year) {
      return res.status(404).json({
        data: null,
        error: 'Class year not found'
      });
    }

    const subjects = all(
      `SELECT 
        id, 
        name, 
        slug, 
        description, 
        manual_path,
        thumbnail_url,
        CASE WHEN manual_path IS NOT NULL 
          THEN '/uploads/' || manual_path 
          ELSE NULL 
        END as manual_url
      FROM subjects 
      WHERE class_year_id = ?`,
      [year.id]
    );

    res.json({
      data: subjects,
      error: null
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to fetch subjects'
    });
  }
});

module.exports = router;
