const Article = require('../models/article.model');
const Category = require('../models/category.model');
const Feedback = require('../models/feedback.model');
const SearchLog = require('../models/searchLog.model');

class KBController {
  // --- Categories ---
  static async getCategories(req, res) {
    try {
      const categories = await Category.find().sort({ name: 1 });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryBySlug(req, res) {
    try {
      const category = await Category.findOne({ slug: req.params.slug });
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --- Articles ---
  static async getArticles(req, res) {
    try {
      const { categorySlug } = req.query;
      let filter = { status: 'published' };
      
      if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) filter.categoryId = category._id;
      }

      const articles = await Article.find(filter)
        .populate('categoryId', 'name slug')
        .sort({ viewCount: -1 });
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getArticleBySlug(req, res) {
    try {
      const { slug } = req.params;
      let article = await Article.findOne({ slug, status: 'published' })
        .populate('categoryId', 'name slug');

      // Robustness: If not found by slug, try searching by ID (Legacy or RAG fallback)
      if (!article && slug.match(/^[0-9a-fA-F]{24}$/)) {
        article = await Article.findOne({ _id: slug, status: 'published' })
          .populate('categoryId', 'name slug');
      }

      if (!article) return res.status(404).json({ error: 'Article not found' });
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async searchArticles(req, res) {
    try {
      const { query, categorySlug } = req.body;
      let filter = { status: 'published' };
      
      if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) filter.categoryId = category._id;
      }

      // Use text search
      const articles = await Article.find({
        ...filter,
        $text: { $search: query }
      }).populate('categoryId', 'name slug');

      // Async search logging
      SearchLog.create({ query, resultsCount: articles.length, userId: req.user?.id }).catch(console.error);

      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async incrementView(req, res) {
    try {
      const article = await Article.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true });
      res.json({ success: true, viewCount: article.viewCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --- Feedback ---
  static async submitFeedback(req, res) {
    try {
      const { articleId, helpful, comment } = req.body;
      const feedback = new Feedback({
        articleId,
        helpful,
        comment,
        userId: req.user?.id
      });
      await feedback.save();

      if (helpful) {
        await Article.findByIdAndUpdate(articleId, { $inc: { helpfulCount: 1 } });
      }

      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = KBController;
