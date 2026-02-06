/**
 * Main Application
 * Reference: Rule 130, 241, 263
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('./middlewares/rateLimit.middleware');
const apiRoutes = require('./routes/api.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rule 252, 259: Restricted logging (No emails, no raw payloads)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[REQUEST] ${req.method} ${req.originalUrl.split('?')[0]} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use('/api', rateLimit);

// Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Rule 301, 305: No silent assumptions -> Fail safely to fallback
app.use((err, req, res, next) => {
  // Rule 259: Minimal info in logs (sanitize err)
  const safeErr = {
    name: err.name || 'Error',
    message: err.message || 'Unknown error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };
  
  console.error(`[ERROR][APP] ${safeErr.name}: ${safeErr.message}`);
  if (safeErr.stack) console.error(safeErr.stack);
  
  if (req.url === '/api/chat/query') {
    return res.status(200).json({
      type: 'fallback',
      message: 'I am sorry, an internal error occurred. Would you like to raise a support ticket?',
      confidenceScore: 0
    });
  }

  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ 
    error: process.env.NODE_ENV === 'development' ? safeErr.message : 'Internal Server Error' 
  });
});

module.exports = app;
