const Engine = require('../engines/answerResolution/engine');
const ChunkRepository = require('../repositories/chunk.repository');
const GeminiService = require('./gemini.service');
const OpenAIService = require('./openai.service');
const VectorService = require('./vector.service');
const { formatChatResponse } = require('../utils/chatResponseFormatter');

class ChatService {
  static async query(question) {
    // 1. Try RAG (Vector Search + LLM)
    try {
      // Use Gemini for free embeddings
      const embedding = await GeminiService.generateEmbedding(question);
      
      if (embedding) {
        const chunks = await ChunkRepository.getPublishedChunks();
        // Rank chunks but only take top 2 to save tokens
        const rankedChunks = VectorService.rankChunks(embedding, chunks, 2);
        const topScore = rankedChunks.length > 0 ? rankedChunks[0].score : 0;
        console.log(`[DEBUG][CHAT_SERVICE] Top Similarity Score: ${topScore}`);
        
        // Threshold check
        if (rankedChunks.length > 0 && topScore >= 0.4) {
          const topChunk = rankedChunks[0];
          
          const context = rankedChunks
            .map(c => c.chunkText)
            .join('\n---\n');

          const messages = [
            { 
              role: 'system', 
              content: `You are a support assistant. Answer using ONLY context. If unsure, say "I don't know". Format: Markdown.` 
            },
            { 
              role: 'user', 
              content: `Context:\n${context}\n\nQuestion: ${question}` 
            }
          ];

          // Try Gemini Completion FIRST
          let answer = null;
          try {
            answer = await GeminiService.generateCompletion(messages);
          } catch (geminiError) {
            console.warn(`[CHAT_SERVICE] Gemini Completion failed (likely 403), trying OpenRouter Free...`);
            // Fallback to OpenRouter FREE models
            const freeModels = [
              'meta-llama/llama-3.1-70b-instruct:free',
              'nousresearch/hermes-3-llama-3.1-405b:free'
            ];
            
            for (const modelId of freeModels) {
              try {
                answer = await OpenAIService.generateCompletion(messages, { model: modelId });
                if (answer) break;
              } catch (orError) {
                console.warn(`[CHAT_SERVICE] OR model ${modelId} failed: ${orError.message}`);
              }
            }
          }

          if (answer) {
            return {
              type: 'answer',
              message: answer,
              articleId: topChunk.articleId?._id || topChunk.articleId || null,
              articleSlug: topChunk.articleId?.slug || null,
              confidenceScore: topChunk.score
            };
          } else {
            // No answer from LLM, return fallback
            console.log('[CHAT_SERVICE] LLM returned no answer, using fallback');
          }
        } else {
          // Confidence too low
          console.log(`[CHAT_SERVICE] Confidence too low (${topScore}), using fallback`);
        }
      }
    } catch (error) {
      console.error(`[WARN][CHAT_SERVICE] RAG failed, falling back to legacy: ${error.message}`);
    }

    // 2. Legacy Fallback (Keyword Matching)
    const chunks = await ChunkRepository.getPublishedChunks();
    const result = Engine.resolve(question, chunks);

    if (result.type === 'answer') {
      const structuredMessage = formatChatResponse(result.articleTitle, result.matchedText);
      
      if (structuredMessage) {
        return {
          ...result,
          message: structuredMessage // Legacy returns Object
        };
      } else {
        return {
          type: 'fallback',
          message: 'I am sorry, I could not find a clear way to present the answer. Would you like to raise a support ticket?'
        };
      }
    }

    return result;
  }
}

module.exports = ChatService;
