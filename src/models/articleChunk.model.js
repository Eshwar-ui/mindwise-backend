const mongoose = require('mongoose');

/**
 * Article Chunk Schema
 * Reference: LONG ARTICLE PROMPT PHASE 2
 */
const articleChunkSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  chunkText: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: false // Optional for backward compatibility, but needed for RAG
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    required: true
  }
}, {
  timestamps: true
});

// Index for performance
articleChunkSchema.index({ articleId: 1 });
articleChunkSchema.index({ status: 1 });
articleChunkSchema.index({ chunkText: 'text' });

module.exports = mongoose.model('ArticleChunk', articleChunkSchema);
