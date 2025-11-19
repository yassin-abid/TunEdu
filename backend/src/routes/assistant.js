const express = require('express');
const router = express.Router();

/**
 * POST /api/v1/assistant/ask
 * AI assistant placeholder endpoint
 * Returns canned response - no real LLM integration
 */
router.post('/ask', (req, res) => {
  try {
    const { subjectSlug, question } = req.body;

    if (!question) {
      return res.status(400).json({
        data: null,
        error: 'Question is required'
      });
    }

    // Canned response for demo
    const cannedResponse = {
      answer: "Fonctionnalité à venir. Je me base sur le manuel pour répondre à vos questions sur le programme tunisien. Cette fonctionnalité d'assistant IA sera bientôt disponible pour vous aider dans vos études.",
      citations: [],
      timestamp: new Date().toISOString()
    };

    res.json({
      data: cannedResponse,
      error: null
    });
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({
      data: null,
      error: 'Failed to process question'
    });
  }
});

module.exports = router;
