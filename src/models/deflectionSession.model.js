const mongoose = require('mongoose');

const deflectionSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  searchQuery: {
    type: String,
    trim: true
  },
  articlesViewed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  ticketCreated: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DeflectionSession', deflectionSessionSchema);
