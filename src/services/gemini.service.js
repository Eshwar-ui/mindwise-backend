const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn("[WARN] GOOGLE_API_KEY is not set. Gemini Service will fail.");
    }
  }

  /**
   * Generate embedding using text-embedding-004
   * @param {string} text 
   * @returns {Promise<number[]>} Vector 768-dim
   */
  async generateEmbedding(text) {
    if (!text || !this.genAI) return null;
    
    try {
      const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error(`[ERROR][GEMINI_SERVICE] Embedding failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate chat response using gemini-1.5-flash
   * @param {Array} messages - OpenAI format [{role, content}]
   * @returns {Promise<string>}
   */
  async generateCompletion(messages) {
    if (!this.genAI) throw new Error("Google API Key missing");

    try {
      // Extract system instruction if present
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessage = messages.find(m => m.role === 'user');

      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        systemInstruction: systemMessage ? systemMessage.content : undefined
      });

      const result = await model.generateContent(userMessage ? userMessage.content : "Hello");
      return result.response.text();
    } catch (error) {
      console.error(`[ERROR][GEMINI_SERVICE] Completion failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new GeminiService();
