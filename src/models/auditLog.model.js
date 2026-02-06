const mongoose = require('mongoose');

/**
 * Audit Log Schema
 * Reference: AUDIT LOG PROMPT
 */
const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    enum: ['article', 'ticket'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityType' // Dynamic ref based on entityType
  },
  adminIdentifier: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
});

// Rule: Audit logs are append-only. Mongoose doesn't strictly prevent updates, 
// but we will only use creation methods in the repository.

module.exports = mongoose.model('AuditLog', auditLogSchema);
