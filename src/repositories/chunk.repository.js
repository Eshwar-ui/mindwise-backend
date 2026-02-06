/**
 * Chunk Repository (MongoDB)
 * Reference: LONG ARTICLE PROMPT PHASE 2 & 3
 */

const ArticleChunk = require('../models/articleChunk.model');

class ChunkRepository {
  /**
   * Replace all chunks for a given article.
   * Ensures chunks stay in sync with article updates.
   */
  static async syncChunks(articleId, chunksInput, status) {
    try {
      // 1. Delete existing chunks
      await ArticleChunk.deleteMany({ articleId });

      // 2. Insert new chunks
      const chunkDocs = chunksInput.map((item, index) => {
        const isString = typeof item === 'string';
        return {
          articleId,
          chunkIndex: index,
          chunkText: isString ? item : item.text,
          embedding: isString ? null : item.embedding,
          status
        };
      });

      if (chunkDocs.length > 0) {
        await ArticleChunk.insertMany(chunkDocs);
      }

      return true;
    } catch (error) {
      console.error(`[ERROR][CHUNK_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  /**
   * Update status of all chunks for an article (e.g. when publishing)
   */
  static async updateStatus(articleId, status) {
    try {
      await ArticleChunk.updateMany({ articleId }, { status });
    } catch (error) {
      console.error(`[ERROR][CHUNK_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete all chunks for an article
   */
  static async deleteChunksByArticle(articleId) {
    try {
      await ArticleChunk.deleteMany({ articleId });
    } catch (error) {
      console.error(`[ERROR][CHUNK_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch all published chunks for searching
   */
  static async getPublishedChunks() {
    try {
      return await ArticleChunk.find({ status: 'published' })
        .populate('articleId', 'title slug category tags')
        .lean();
    } catch (error) {
      console.error(`[ERROR][CHUNK_REPOSITORY] ${error.message}`);
      return [];
    }
  }
}

module.exports = ChunkRepository;
