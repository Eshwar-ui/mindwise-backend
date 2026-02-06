require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('../src/models/article.model');
const ArticleChunk = require('../src/models/articleChunk.model');
const ChatService = require('../src/services/chat.service');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const question = "How do I change my password?";
    console.log(`Question: ${question}`);
    console.log('Querying ChatService...');
    
    const result = await ChatService.query(question);
    
    console.log('\nResult:');
    console.log(JSON.stringify(result, null, 2));
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
test();
