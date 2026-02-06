/**
 * Server Entry Point
 * Reference: Rule 130
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

// Rule 263: Initialize database
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[SYSTEM] Server running on port ${PORT}`);
  console.log(`[SYSTEM] deterministic "Service Knowledge Base Chatbot" logic active.`);
});
