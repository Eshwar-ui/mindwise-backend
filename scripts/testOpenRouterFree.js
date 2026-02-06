const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY
});

async function test() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-flash-1.5:free',
      messages: [{ role: 'user', content: 'Say hello' }]
    });
    console.log('SUCCESS:', completion.choices[0].message.content);
  } catch (e) {
    console.error('FAILURE:', e.message);
  }
}
test();
