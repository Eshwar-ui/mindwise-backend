const mongoose = require('mongoose');

/**
 * Ticket Schema
 * Reference: SETUP PROMPT STEP 4 + FRONTEND SYNC
 */
const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for management
ticketSchema.index({ status: 1 });
ticketSchema.index({ userId: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
