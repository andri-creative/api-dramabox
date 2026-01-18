import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dramaRoutes from './routes/drama.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS untuk semua origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DramaBox API - Self-Hosted Version',
    version: '1.0.0',
    endpoints: {
      latest: '/api/latest?page=1&channelId=43',
      search: '/api/search?q=keyword',
      stream: '/api/stream/:bookId?episode=1',
      health: '/api/health'
    },
    documentation: '/api/docs'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    documentation: {
      latest: {
        endpoint: 'GET /api/latest',
        description: 'Get latest dramas',
        parameters: {
          page: 'Page number (default: 1)',
          channelId: 'Channel ID (default: 43)'
        },
        example: '/api/latest?page=1'
      },
      search: {
        endpoint: 'GET /api/search',
        description: 'Search dramas by keyword',
        parameters: {
          q: 'Search keyword (required)'
        },
        example: '/api/search?q=pewaris'
      },
      stream: {
        endpoint: 'GET /api/stream/:bookId',
        description: 'Get streaming links for a drama',
        parameters: {
          bookId: 'Drama book ID (required, in path)',
          episode: 'Episode number (default: 1)'
        },
        example: '/api/stream/41000102902?episode=1'
      }
    }
  });
});

// Mount routes
app.use('/api', dramaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 DramaBox API Server Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Local: http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  - GET /api/latest`);
  console.log(`  - GET /api/search`);
  console.log(`  - GET /api/stream/:bookId`);
  console.log(`  - GET /api/health`);
});

export default app;
