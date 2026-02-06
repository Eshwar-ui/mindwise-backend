/**
 * Answer Resolution Engine
 * Reference: Rule 154, 176, 271
 * 
 * Strict deterministic matching and retrieval system.
 */

const THRESHOLD = 0.5; // Confidence threshold as per Rule 160, 182

class AnswerResolutionEngine {
  /**
   * Normalize query text
   * Reference: Rule 148, 179
   */
  static normalize(text) {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
  }

  /**
   * Search chunks and score relevance
   * Reference: LONG ARTICLE PROMPT PHASE 3
   */
  static resolve(query, chunks) {
    if (!query || query.trim().length === 0) {
      return {
        type: 'fallback',
        message: 'I am sorry, I could not find a relevant section to answer your question. Would you like to raise a support ticket?',
        confidenceScore: 0
      };
    }

    const normalizedQuery = this.normalize(query);
    const queryWords = normalizedQuery.split(/\s+/);

    const scoredChunks = chunks
      .filter(chunk => chunk.status === 'published')
      .map(chunk => {
        const score = this.calculateChunkScore(normalizedQuery, queryWords, chunk);
        return {
          chunk,
          score
        };
      })
      .sort((a, b) => b.score - a.score);

    if (scoredChunks.length > 0 && scoredChunks[0].score >= THRESHOLD) {
      const bestMatch = scoredChunks[0];
      
      return {
        type: 'answer',
        articleTitle: bestMatch.chunk.articleId?.title || "Knowledge Base",
        matchedText: bestMatch.chunk.chunkText,
        articleId: bestMatch.chunk.articleId?._id || bestMatch.chunk.articleId || null,
        confidenceScore: bestMatch.score
      };
    }

    // Rule: If NO chunk crosses threshold -> fallback
    return {
      type: 'fallback',
      message: 'I am sorry, I could not find a relevant section to answer your question in our articles. Would you like to raise a support ticket?',
      confidenceScore: scoredChunks.length > 0 ? scoredChunks[0].score : 0
    };
  }

  /**
   * Score a chunk based on its text and parent article metadata
   * Reference: LONG ARTICLE PROMPT PHASE 3, Rule 271
   */
  static calculateChunkScore(normalizedQuery, queryWords, chunk) {
    // Parent context (Rule: Compare query against chunkText, title, tags)
    const article = chunk.articleId || {};
    const title = this.normalize(article.title || '');
    const tags = (article.tags || []).map(t => this.normalize(t)).join(' ');
    const chunkText = this.normalize(chunk.chunkText);

    const fullContext = `${title} ${tags} ${chunkText}`;
    const contextWords = fullContext.split(/\s+/);
    
    // Intersection of words
    const matches = queryWords.filter(word => contextWords.includes(word));
    let score = matches.length / Math.max(queryWords.length, 1);
    
    // Boost for exact title match
    if (title.includes(normalizedQuery)) {
      score += 0.2;
    }

    // Boost for exact chunk text match
    if (chunkText.includes(normalizedQuery)) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }
}

module.exports = AnswerResolutionEngine;
