/**
 * Admin Controller
 * Reference: ADMIN ARTICLE CRUD, ADMIN TICKET MANAGEMENT, AUDIT LOGGING
 */

const ArticleRepository = require('../repositories/article.repository');
const TicketRepository = require('../repositories/ticket.repository');
const AuditLogRepository = require('../repositories/auditLog.repository');
const ChunkRepository = require('../repositories/chunk.repository');
const ChunkingService = require('../services/chunking.service');
const Category = require('../models/category.model');
const Article = require('../models/article.model');
const GeminiService = require('../services/gemini.service');
const slugify = require('slugify');

class AdminController {
  // --- Article Management ---

  static async createArticle(req, res) {
    try {
      const { 
        title, content, categoryId, tags, status, 
        problemStatement, steps, troubleshootingTips 
      } = req.body;
      const adminIdentifier = req.user.email;

      if (!title || !content || !categoryId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const article = await ArticleRepository.createArticle({
        title, content, categoryId, 
        problemStatement, steps, troubleshootingTips,
        tags: tags || [], 
        status: status || 'draft'
      });

      // Sync Chunks with Embeddings
      const chunksText = ChunkingService.chunkContent(article.content);
      const chunksData = [];
      
      for (const text of chunksText) {
        let embedding = null;
        try {
          embedding = await GeminiService.generateEmbedding(text);
        } catch (e) {
          console.error(`[WARN] Failed to generate embedding for creation: ${e.message}`);
        }
        chunksData.push({ text, embedding });
      }

      await ChunkRepository.syncChunks(article._id, chunksData, article.status);

      // Audit Log
      await AuditLogRepository.logAction({
        action: 'ARTICLE_CREATED',
        entityType: 'article',
        entityId: article._id,
        adminIdentifier,
        metadata: { title: article.title, status: article.status }
      });

      res.status(201).json(article);
    } catch (error) {
      console.error(`[ERROR][ADMIN_CONTROLLER] ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllArticles(req, res) {
    try {
      const articles = await ArticleRepository.getAllArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getArticleById(req, res) {
    try {
      const { id } = req.params;
      const article = await ArticleRepository.getArticleById(id);
      if (!article) return res.status(404).json({ error: 'Article not found' });
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const adminIdentifier = req.user.email;

      const article = await ArticleRepository.updateArticle(id, updateData);
      if (!article) return res.status(404).json({ error: 'Article not found' });

      // Sync Chunks if content or status changed
      if (updateData.content !== undefined || updateData.status !== undefined) {
        const chunksText = ChunkingService.chunkContent(article.content);
        const chunksData = [];
        
        for (const text of chunksText) {
          let embedding = null;
          // Only generate embedding if content changed (optimization), 
          // but simpler to regenerate all for now since we replace all chunks.
          try {
            embedding = await GeminiService.generateEmbedding(text);
          } catch (e) {
            console.error(`[WARN] Failed to generate embedding for update: ${e.message}`);
          }
          chunksData.push({ text, embedding });
        }
        
        await ChunkRepository.syncChunks(article._id, chunksData, article.status);
      }

      // Determine audit action
      const isStatusOnly = updateData.status && Object.keys(updateData).length === 1;
      const action = isStatusOnly ? 'ARTICLE_STATUS_CHANGED' : 'ARTICLE_UPDATED';

      // Audit Log
      await AuditLogRepository.logAction({
        action,
        entityType: 'article',
        entityId: article._id,
        adminIdentifier,
        metadata: { 
          title: article.title, 
          status: article.status,
          updatedFields: Object.keys(updateData).filter(k => k !== 'content')
        }
      });

      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      const adminIdentifier = 'AUTHORIZED_ADMIN';
      
      const article = await ArticleRepository.deleteArticle(id);
      if (!article) return res.status(404).json({ error: 'Article not found' });

      // Clean up chunks
      await ChunkRepository.deleteChunksByArticle(id);

      // Audit Log
      await AuditLogRepository.logAction({
        action: 'ARTICLE_DELETED',
        entityType: 'article',
        entityId: id,
        adminIdentifier,
        metadata: { title: article.title }
      });

      res.json({ message: 'Article deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // --- Ticket Management ---

  static async getAllTickets(req, res) {
    try {
      const tickets = await TicketRepository.getAllTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = await TicketRepository.getTicketById(id);
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const adminIdentifier = 'AUTHORIZED_ADMIN';

      if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const ticket = await TicketRepository.updateTicketStatus(id, status);
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

      // Audit Log
      await AuditLogRepository.logAction({
        action: 'TICKET_STATUS_UPDATED',
        entityType: 'ticket',
        entityId: id,
        adminIdentifier,
        metadata: { status }
      });

      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // --- Category Management ---

  static async createCategory(req, res) {
    try {
      const { name, description, icon } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });

      const slug = slugify(name, { lower: true, strict: true });
      const category = new Category({ name, description, icon, slug });
      await category.save();

      res.status(201).json(category);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Category already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description, icon } = req.body;
      
      const updateData = { description, icon };
      if (name) {
        updateData.name = name;
        updateData.slug = slugify(name, { lower: true, strict: true });
      }

      const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
      if (!category) return res.status(404).json({ error: 'Category not found' });

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      // Check if any articles use this category
      const articleCount = await Article.countDocuments({ categoryId: id });
      if (articleCount > 0) {
        return res.status(400).json({ error: 'Cannot delete category with associated articles' });
      }

      const category = await Category.findByIdAndDelete(id);
      if (!category) return res.status(404).json({ error: 'Category not found' });

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdminController;
