require('dotenv').config();
const mongoose = require('mongoose');
const ArticleChunk = require('../src/models/articleChunk.model');
const GeminiService = require('../src/services/gemini.service');
const VectorService = require('../src/services/vector.service');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 1. Embed Question
    const question = "How do I change my password?";
    console.log(`Embedding Question: "${question}"...`);
    const qEmb = await GeminiService.generateEmbedding(question);
    
    // 2. Fetch Chunks
    const chunks = await ArticleChunk.find({ embedding: { $exists: true, $ne: [] } }).lean();
    console.log(`Fetched ${chunks.length} chunks with embeddings.`);
    
    // 3. Rank
    const ranked = VectorService.rankChunks(qEmb, chunks, 5);
    
    console.log('\n--- Top 5 Matches ---');
    ranked.forEach((r, i) => {
      console.log(`${i+1}. Score: ${r.score.toFixed(4)}`);
      // console.log(`   Text: ${r.chunkText.substring(0, 100)}...`);
      console.log(`   Article ID: ${r.articleId}`);
    });
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
debug();
