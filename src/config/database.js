/**
 * MongoDB Connection
 * Reference: SETUP PROMPT STEP 3
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[CRITICAL] MONGODB_URI is missing in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[SYSTEM] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[CRITICAL] MongoDB connection failed: ${error.message}`);
    process.exit(1); // Crash application if connection fails
  }
};

module.exports = connectDB;
