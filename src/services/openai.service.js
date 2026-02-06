const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const config = { apiKey };
    
    // Check for OpenRouter key format
    if (apiKey && apiKey.startsWith('sk-or-v1-')) {
      config.baseURL = 'https://openrouter.ai/api/v1';
    }

    this.openai = new OpenAI(config);
  }

  /**
   * Generate embedding for a given text
   * Uses text-embedding-3-small by default (efficient and cheap)
   * @param {string} text 
   * @returns {Promise<number[]>} Vector embedding
   */
  async generateEmbedding(text) {
    if (!text) return null;
    
    try {
      // Clean text slightly to improve embedding quality
      const cleanText = text.replace(/\n/g, ' ').trim();
      
      const response = await this.openai.embeddings.create({
        model: this.openai.baseURL && this.openai.baseURL.includes('openrouter') 
          ? "openai/text-embedding-3-small" 
          : "text-embedding-3-small",
        input: cleanText,
        encoding_format: "float",
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error(`[ERROR][OPENAI_SERVICE] Embedding generation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a chat completion
   * @param {Array} messages - List of message objects [{role: 'user', content: '...'}]
   * @param {number} temperature - Randomness (default 0.7)
   * @returns {Promise<string>} Generated text
   */
  async generateCompletion(messages, options = {}) {
    try {
      const { temperature = 0.7, model } = options;
      
      const completion = await this.openai.chat.completions.create({
        messages,
        model: model || (this.openai.baseURL && this.openai.baseURL.includes('openrouter') 
          ? "openai/gpt-4o-mini" 
          : "gpt-4o-mini"), 
        temperature,
        max_tokens: 250
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error(`[ERROR][OPENAI_SERVICE] Completion failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new OpenAIService();
