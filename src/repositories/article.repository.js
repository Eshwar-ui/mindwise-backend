const Article = require('../models/article.model');

class ArticleRepository {
  static async getPublishedArticles() {
    try {
      return await Article.find({ status: 'published' })
        .populate('categoryId', 'name slug')
        .sort({ viewCount: -1 })
        .lean();
    } catch (error) {
      console.error(`[ERROR][ARTICLE_REPOSITORY] ${error.message}`);
      return [];
    }
  }

  static async createArticle(data) {
    try {
      const article = new Article(data);
      return await article.save();
    } catch (error) {
      console.error(`[ERROR][ARTICLE_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async getAllArticles() {
    try {
      return await Article.find({}).populate('categoryId', 'name slug').sort({ updatedAt: -1 }).lean();
    } catch (error) {
      console.error(`[ERROR][ARTICLE_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async getArticleById(id) {
    try {
      return await Article.findById(id).populate('categoryId', 'name slug id').lean();
    } catch (error) {
      console.error(`[ERROR][ARTICLE_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async getArticleBySlug(slug) {
    try {
      return await Article.findOne({ slug, status: 'published' }).populate('categoryId', 'name slug id').lean();
    } catch (error) {
      console.error(`[ERROR][ARTICLE_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async updateArticle(id, data) {
    try {
      const article = await Article.findById(id);
      if (!article) return null;
      
      Object.assign(article, data);
      return await article.save();
    } catch (error) {
      console.error(`[ERROR][ARTICLE_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async deleteArticle(id) {
    try {
      return await Article.findByIdAndDelete(id).lean();
    } catch (error) {
      console.error(`[ERROR][ARTICLE_REPOSITORY] ${error.message}`);
      throw error;
    }
  }
}

module.exports = ArticleRepository;
