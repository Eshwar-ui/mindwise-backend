require('dotenv').config();
const mongoose = require('mongoose');
const ArticleChunk = require('../src/models/articleChunk.model');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await ArticleChunk.countDocuments({ embedding: { $exists: true, $ne: [] } });
    const total = await ArticleChunk.countDocuments({});
    console.log(`Chunks with embeddings: ${count} / ${total}`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
