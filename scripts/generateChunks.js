require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('../src/models/article.model');
const Category = require('../src/models/category.model');
const ChunkRepository = require('../src/repositories/chunk.repository');
const ChunkingService = require('../src/services/chunking.service');

/**
 * Generate chunks for all existing articles
 * This is needed when articles exist but chunks haven't been created yet
 */
async function generateChunks() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Get all articles
    const articles = await Article.find({}).populate('categoryId', 'name');
    console.log(`\n📚 Found ${articles.length} articles`);

    if (articles.length === 0) {
      console.log('⚠️  No articles found. Run seedData.js first.');
      process.exit(0);
    }

    let processedCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        console.log(`\n📄 Processing: "${article.title}"`);
        console.log(`   Category: ${article.categoryId?.name || 'N/A'}`);
        console.log(`   Status: ${article.status}`);
        
        // Generate chunks from content
        const chunks = ChunkingService.chunkContent(article.content);
        console.log(`   Generated ${chunks.length} chunk(s)`);
        
        // Sync chunks to database
        await ChunkRepository.syncChunks(article._id, chunks, article.status);
        console.log(`   ✓ Chunks synced to database`);
        
        processedCount++;
      } catch (error) {
        console.error(`   ✗ Error processing article: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✓ Processing complete!`);
    console.log(`  - Successfully processed: ${processedCount} articles`);
    console.log(`  - Errors: ${errorCount}`);
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Fatal error:', error.message);
    process.exit(1);
  }
}

generateChunks();
