/**
 * Vector Service
 * Utilities for vector operations (Cosine Similarity)
 */

class VectorService {
  /**
   * Calculate Cosine Similarity between two vectors
   * @param {number[]} vecA 
   * @param {number[]} vecB 
   * @returns {number} Similarity score (-1 to 1)
   */
  static calculateCosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Rank chunks by similarity to query vector
   * @param {number[]} queryVector 
   * @param {Array} chunks - Array of chunk objects with 'embedding' field
   * @param {number} topK - Number of results to return
   * @returns {Array} Ranked chunks with score
   */
  static rankChunks(queryVector, chunks, topK = 5) {
    if (!queryVector || !chunks || chunks.length === 0) return [];

    const scoredChunks = chunks
      .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
      .map(chunk => ({
        ...chunk,
        score: this.calculateCosineSimilarity(queryVector, chunk.embedding)
      }))
      .sort((a, b) => b.score - a.score) // Descending order
      .slice(0, topK);

    return scoredChunks;
  }
}

module.exports = VectorService;
