const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Article Schema
 * Reference: SETUP PROMPT STEP 4 + EXTENDED FRONTEND FIELDS
 */
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  problemStatement: {
    type: String,
    trim: true
  },
  content: {
    type: String, // Full searchable content
    required: true
  },
  steps: [{
    title: String,
    description: String
  }],
  troubleshootingTips: {
    type: String,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    required: true,
    default: 'draft'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug
articleSchema.pre('save', function() {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

// Performance Indexes
articleSchema.index({ status: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ categoryId: 1 });
// articleSchema.index({ slug: 1 }); // Removed (duplicate of unique: true)
articleSchema.index({ updatedAt: -1 });
articleSchema.index({ viewCount: -1 });

// Compound Text Index for search optimization
articleSchema.index({ title: 'text', content: 'text', problemStatement: 'text' });

module.exports = mongoose.model('Article', articleSchema);
