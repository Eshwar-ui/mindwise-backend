require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./src/models/article.model');

async function checkArticles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const articles = await Article.find({}, 'title slug status');
    console.log('Current Articles:');
    console.log(JSON.stringify(articles, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkArticles();
