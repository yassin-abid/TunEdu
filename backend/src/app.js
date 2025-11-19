require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./db');

// Initialize database
initializeDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const browseRoutes = require('./routes/browse');
const subjectsRoutes = require('./routes/subjects');
const lessonsRoutes = require('./routes/lessons');
const interactionsRoutes = require('./routes/interactions');
const activityRoutes = require('./routes/activity');
const assistantRoutes = require('./routes/assistant');
const studioRoutes = require('./routes/studio');

// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', browseRoutes);
app.use('/api/v1/subjects', subjectsRoutes);
app.use('/api/v1/lessons', lessonsRoutes);
app.use('/api/v1', interactionsRoutes);
app.use('/api/v1/activity', activityRoutes);
app.use('/api/v1/assistant', assistantRoutes);
app.use('/api/v1/studio', studioRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    },
    error: null
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    data: null,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    data: null,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TunEdu Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, '..', 'uploads')}`);
});

module.exports = app;
