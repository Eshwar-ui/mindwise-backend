/**
 * Firebase Admin SDK Initialization
 * Reference: FIREBASE FS INTEGRATION PROMPT
 */

const admin = require('firebase-admin');

// Load credentials from environment variables (Step 1)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : null;

if (!serviceAccount) {
  console.error('[CRITICAL] Missing FIREBASE_SERVICE_ACCOUNT environment variable.');
  process.exit(1); // Fail fast as per checklist
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Export Firestore instance (Step 1)
module.exports = db;
