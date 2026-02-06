/**
 * API Validation Middleware
 * Reference: API CONTRACT RULES (MANDATORY)
 */

class ValidationMiddleware {
  /**
   * Validate Chat Query request
   * Rule: Accept ONLY a non-empty string question. Reject null, undefined, or empty.
   */
  static validateChatQuery(req, res, next) {
    const { question, ...extraFields } = req.body;

    // Rule: Reject unexpected fields
    if (Object.keys(extraFields).length > 0) {
      return res.status(400).json({ error: 'Unexpected fields in request body' });
    }

    if (typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'A non-empty string "question" is required' });
    }

    // Rule: Normalize input BEFORE processing (done in controller/service, but we ensure it's a string here)
    next();
  }

  /**
   * Validate Ticket Creation request
   * Rule: Required fields: userName, email, question.
   */
  static validateTicketCreation(req, res, next) {
    const { userName, email, question, ...extraFields } = req.body;

    // Rule: Reject unexpected fields
    if (Object.keys(extraFields).length > 0) {
      return res.status(400).json({ error: 'Unexpected fields in request body' });
    }

    const missing = [];
    if (!userName) missing.push('userName');
    if (!email) missing.push('email');
    if (!question) missing.push('question');

    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    if (typeof userName !== 'string' || userName.trim().length === 0) {
      return res.status(400).json({ error: 'userName must be a non-empty string' });
    }
    if (typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ error: 'email must be a non-empty string' });
    }
    if (typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'question must be a non-empty string' });
    }

    next();
  }
}

module.exports = ValidationMiddleware;
