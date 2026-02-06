/**
 * Admin Routes
 * Reference: ADMIN ARTICLE CRUD, ADMIN TICKET MANAGEMENT
 */

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

// Apply Admin Auth to all routes in this router
router.use(AuthMiddleware.verifyAdmin);

// Article CRUD
router.post('/articles', AdminController.createArticle);
router.get('/articles', AdminController.getAllArticles);
router.get('/articles/:id', AdminController.getArticleById);
router.put('/articles/:id', AdminController.updateArticle);
router.delete('/articles/:id', AdminController.deleteArticle);

// Category Management
router.post('/categories', AdminController.createCategory);
router.put('/categories/:id', AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

// Ticket Management
router.get('/tickets', AdminController.getAllTickets);
router.get('/tickets/:id', AdminController.getTicketById);
router.put('/tickets/:id/status', AdminController.updateTicketStatus);

module.exports = router;
