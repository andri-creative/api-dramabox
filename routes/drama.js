import express from 'express';
import dramaboxClient from '../utils/dramaboxClient.js';

const router = express.Router();

/**
 * GET /api/latest
 * Get latest dramas
 * Query params: page (default: 1), channelId (default: 43)
 */
router.get('/latest', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const channelId = parseInt(req.query.channelId) || 43;

    // Validate
    if (page < 1) {
      return res.status(400).json({
        success: false,
        error: 'Page number must be >= 1'
      });
    }

    const dramas = await dramaboxClient.getLatest(page, channelId);

    res.json({
      success: true,
      data: {
        page,
        channelId,
        dramas
      }
    });
  } catch (error) {
    console.error('Error in /api/latest:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest dramas',
      message: error.message
    });
  }
});

/**
 * GET /api/search
 * Search dramas
 * Query params: q (required)
 */
router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.q;

    // Validate
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search keyword (q) is required'
      });
    }

    const results = await dramaboxClient.search(keyword);

    res.json({
      success: true,
      data: {
        keyword,
        results
      }
    });
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search dramas',
      message: error.message
    });
  }
});

/**
 * GET /api/stream/:bookId
 * Get streaming links for a drama
 * Params: bookId (required)
 * Query params: episode (default: 1)
 */
router.get('/stream/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const episode = parseInt(req.query.episode) || 1;

    // Validate
    if (!bookId) {
      return res.status(400).json({
        success: false,
        error: 'Book ID is required'
      });
    }

    if (episode < 1) {
      return res.status(400).json({
        success: false,
        error: 'Episode number must be >= 1'
      });
    }

    const streamingLinks = await dramaboxClient.getStreamingLinks(bookId, episode);

    res.json({
      success: true,
      data: {
        bookId,
        episode,
        streamingLinks
      }
    });
  } catch (error) {
    console.error('Error in /api/stream:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch streaming links',
      message: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
