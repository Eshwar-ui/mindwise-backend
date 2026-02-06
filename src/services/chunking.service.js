/**
 * Chunking Service
 * Reference: LONG ARTICLE PROMPT PHASE 2
 */

class ChunkingService {
  /**
   * Split text into chunks of approximately 300-500 words.
   * Simple deterministic splitting by word count.
   */
  static chunkContent(text, minWords = 300, maxWords = 500) {
    if (!text) return [];

    const paragraphs = text.split(/\n\s*\n/);
    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;

    for (const paragraph of paragraphs) {
      const wordCount = paragraph.split(/\s+/).length;

      if (currentWordCount + wordCount > maxWords && currentChunk.length > 0) {
        // Save current chunk and start new one
        chunks.push(currentChunk.join('\n\n'));
        currentChunk = [paragraph];
        currentWordCount = wordCount;
      } else {
        currentChunk.push(paragraph);
        currentWordCount += wordCount;
      }
    }

    // Add remaining content
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'));
    }

    return chunks;
  }
}

module.exports = ChunkingService;
