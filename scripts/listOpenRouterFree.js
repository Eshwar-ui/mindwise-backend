const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY
});

async function test() {
  try {
    const list = await openai.models.list();
    const freeModels = list.data.filter(m => m.id.includes(':free'));
    console.log('FREE MODELS:', freeModels.map(m => m.id));
  } catch (e) {
    console.error('FAILURE:', e.message);
  }
}
test();
