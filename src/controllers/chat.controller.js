/**
 * Chat Controller
 * Reference: Rule 144, 153
 * 
 * Accepts and orchestrates user chat queries.
 */

const ArticleRepository = require('../repositories/article.repository');
const ChatService = require('../services/chat.service');

class ChatController {
  static async getArticles(req, res) {
    try {
      const articles = await ArticleRepository.getPublishedArticles();
      res.json(articles);
    } catch (error) {
      console.error(`[ERROR][CHAT_CONTROLLER] ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async query(req, res) {
    try {
      const { question } = req.body;
      
      // Enhanced validation with helpful error messages
      if (!question) {
        return res.status(400).json({ 
          error: 'Please enter a question',
          message: 'Your question cannot be empty. Please type a question and try again.'
        });
      }
      
      if (typeof question !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid question format',
          message: 'Your question must be text. Please try again.'
        });
      }
      
      const trimmedQuestion = question.trim();
      if (trimmedQuestion.length === 0) {
        return res.status(400).json({ 
          error: 'Please enter a question',
          message: 'Your question cannot be empty. Please type a question and try again.'
        });
      }
      
      if (trimmedQuestion.length < 3) {
        return res.status(400).json({ 
          error: 'Question too short',
          message: 'Please provide a more detailed question (at least 3 characters).'
        });
      }
      
      if (trimmedQuestion.length > 500) {
        return res.status(400).json({ 
          error: 'Question too long',
          message: 'Please keep your question under 500 characters.'
        });
      }

      const result = await ChatService.query(trimmedQuestion);

      // Response MUST be exactly ONE of: SUCCESS (Answer) or FALLBACK
      if (result.type === 'answer') {
        res.json({
          type: "answer",
          message: result.message,
          articleId: result.articleId,
          articleSlug: result.articleSlug,
          confidenceScore: result.confidenceScore
        });
      } else {
        res.json({
          type: "fallback",
          message: result.message
        });
      }
    } catch (error) {
      // Rule 104, 251: Logs for debugging
      console.error(`[ERROR][CHAT_CONTROLLER] ${error.message}`);
      res.status(500).json({ 
        error: 'Unable to process your question',
        message: 'We\'re experiencing technical difficulties. Please try again in a moment.'
      });
    }
  }
}

module.exports = ChatController;
