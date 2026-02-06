const DeflectionSession = require('../models/deflectionSession.model');
const { v4: uuidv4 } = require('uuid');

class DeflectionController {
  static async createSession(req, res) {
    try {
      const { searchQuery } = req.body;
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const session = new DeflectionSession({
        sessionId,
        userId: req.user?.id,
        searchQuery,
        articlesViewed: [],
        ticketCreated: false
      });

      await session.save();
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSession(req, res) {
    try {
      const { id } = req.params;
      const { articleViewed, ticketCreated } = req.body;
      
      const updates = {};
      if (articleViewed) {
        updates.$addToSet = { articlesViewed: articleViewed };
      }
      if (ticketCreated !== undefined) {
        updates.ticketCreated = ticketCreated;
        updates.completedAt = new Date();
      }

      const session = await DeflectionSession.findByIdAndUpdate(id, updates, { new: true });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DeflectionController;
