const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const KBController = require('../controllers/kb.controller');
const ChatController = require('../controllers/chat.controller');
const TicketController = require('../controllers/ticket.controller');
const DeflectionController = require('../controllers/deflection.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

// --- Auth Routes ---
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', AuthMiddleware.verifyUser, AuthController.me);

// --- Knowledge Base Routes ---
router.get('/kb/categories', KBController.getCategories);
router.get('/kb/categories/:slug', KBController.getCategoryBySlug);
router.get('/kb/articles', KBController.getArticles);
router.get('/kb/articles/:slug', KBController.getArticleBySlug);
router.post('/kb/search', KBController.searchArticles);
router.post('/kb/article/:id/view', KBController.incrementView);
router.post('/kb/feedback', KBController.submitFeedback);

// --- Chat Routes ---
router.post('/chat/query', ChatController.query);

// --- Deflection Routes ---
router.post('/deflection/sessions', DeflectionController.createSession);
router.patch('/deflection/sessions/:id', DeflectionController.updateSession);

// --- Ticket Routes ---
router.post('/tickets', AuthMiddleware.verifyUser, TicketController.create);
router.get('/tickets', AuthMiddleware.verifyUser, TicketController.getUserTickets);
router.get('/tickets/:id', AuthMiddleware.verifyUser, TicketController.getTicketById);

const AnalyticsController = require('../controllers/analytics.controller');

// ... existing imports ...

// --- Analytics Routes ---
router.get('/analytics/summary', AuthMiddleware.verifyAdmin, AnalyticsController.getSummary);

module.exports = router;
