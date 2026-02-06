/**
 * Response Builder Service
 * Reference: RESPONSE CONSTRUCTION PROMPT
 */

class ResponseBuilder {
  /**
   * Constructs a chat-friendly response from a matched article chunk.
   * Rules: Deterministic, Grounded, Concise.
   */
  static constructResponse(articleTitle, chunkText) {
    if (!chunkText) return null;

    // 1. Contextual Line
    const prefix = `Here’s what our ${articleTitle} says:`;

    // 2. Extract and Format Content
    // We split into sentences and take only the most relevant ones or the first few if it's a policy block.
    // For this deterministic implementation, we will:
    // a) Split by newlines/sentences
    // b) Filter out very short or purely structural lines
    // c) Format as bullets if multiple sections detected
    
    const lines = chunkText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 5);
    
    let formattedContent = "";
    if (lines.length > 1) {
      // Use bullet points for multi-line content (preferred for policies)
      // Limit to 6 bullets max as per rule
      const limitedLines = lines.slice(0, 6);
      formattedContent = limitedLines.map(line => `• ${line}`).join('\n');
    } else {
      // Single paragraph
      formattedContent = lines[0];
    }

    // 3. Length Enforcement (Max ~150-200 words)
    const words = formattedContent.split(/\s+/);
    if (words.length > 200) {
      // If we can't represent it concisely, we might need to fallback, 
      // but let's try to just take the first 150 words.
      formattedContent = words.slice(0, 150).join(' ') + '...';
    }

    // 4. Final Construction
    const suffix = "\n\nIf you need more help, you can contact support.";
    const fullMessage = `${prefix}\n\n${formattedContent}${suffix}`;

    return fullMessage;
  }
}

module.exports = ResponseBuilder;
