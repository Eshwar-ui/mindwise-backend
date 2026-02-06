require('dotenv').config();
const mongoose = require('mongoose');
const ArticleChunk = require('../src/models/articleChunk.model');
const GeminiService = require('../src/services/gemini.service');

async function generateEmbeddings() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not found');
    
    // Warn if no Google Key
    if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ GOOGLE_API_KEY missing. Cannot generate Gemini embeddings.');
        process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    const chunks = await ArticleChunk.find({});
    console.log(`Found ${chunks.length} chunks to process...`);
    console.log('Regenerating ALL embeddings for Gemini (Force Overwrite)...');

    let updatedCount = 0;
    let errorCount = 0;

    for (const chunk of chunks) {
      try {
        if (!chunk.chunkText) continue;

        console.log(`Processing chunk ${chunk._id} (Article: ${chunk.articleId})...`);
        const embedding = await GeminiService.generateEmbedding(chunk.chunkText);
        
        if (embedding) {
          chunk.embedding = embedding;
          await chunk.save();
          updatedCount++;
        }
      } catch (e) {
        console.error(`Error processing chunk ${chunk._id}: ${e.message}`);
        errorCount++;
      }
    }

    console.log('\nProcessing Complete!');
    console.log(`Updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
}

generateEmbeddings();
