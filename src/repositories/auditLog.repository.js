/**
 * Audit Log Repository
 * Reference: AUDIT LOG PROMPT
 */

const AuditLog = require('../models/auditLog.model');

class AuditLogRepository {
  /**
   * Create an audit log entry
   * Rule: Metadata must NOT include PII or content
   */
  static async logAction({ action, entityType, entityId, adminIdentifier, metadata = {} }) {
    try {
      const logEntry = new AuditLog({
        action,
        entityType,
        entityId,
        adminIdentifier,
        metadata
      });

      return await logEntry.save();
    } catch (error) {
      // Rule: Logging failure must NOT block main action
      console.error(`[ERROR][AUDIT_LOG_REPOSITORY] Failed to log action: ${error.message}`);
    }
  }
}

module.exports = AuditLogRepository;
