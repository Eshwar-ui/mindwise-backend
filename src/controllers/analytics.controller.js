const Article = require('../models/article.model');
const Ticket = require('../models/ticket.model');
const SearchLog = require('../models/searchLog.model');
const DeflectionSession = require('../models/deflectionSession.model');
const { subDays } = require('date-fns');

class AnalyticsController {
  static async getSummary(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      const startDate = subDays(new Date(), days);

      // 1. Article Views Total
      const articles = await Article.find({ status: 'published' });
      const kbViews = articles.reduce((sum, art) => sum + (art.viewCount || 0), 0);

      // 2. Tickets Aggregates
      const tickets = await Ticket.find({ createdAt: { $gte: startDate } });
      const ticketsCreated = tickets.length;
      const ticketsResolved = tickets.filter(t => t.status === 'Resolved').length;

      // 3. Search Terms
      const searchLogs = await SearchLog.find({ createdAt: { $gte: startDate } });
      const termCounts = {};
      searchLogs.forEach(log => {
        const term = log.query.toLowerCase().trim();
        termCounts[term] = (termCounts[term] || 0) + 1;
      });
      const topSearchTerms = Object.entries(termCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([term, count]) => ({ term, count }));

      // 4. Deflection Stats
      const deflections = await DeflectionSession.find({ createdAt: { $gte: startDate } });
      const sessionsWithViews = deflections.filter(s => s.articlesViewed?.length > 0);
      const ticketsAvoided = sessionsWithViews.filter(s => !s.ticketCreated).length;
      const selfResolutionRate = sessionsWithViews.length > 0
        ? (ticketsAvoided / sessionsWithViews.length) * 100
        : 0;

      // 5. Category Distribution
      const categoryCounts = {};
      tickets.forEach(t => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
      });
      const categoryDistribution = Object.entries(categoryCounts)
        .map(([name, value]) => ({ name, value }));

      res.json({
        totals: {
          kbViews,
          ticketsCreated,
          ticketsResolved,
          avgResolutionHours: 24, // Mocked for now
        },
        selfResolutionRate,
        ticketsAvoided,
        topSearchTerms,
        categoryDistribution,
        dailyData: [] // Mocked or implement time-series if needed
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalyticsController;
