require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/category.model');
const Article = require('./src/models/article.model');
const User = require('./src/models/user.model');
const ChunkRepository = require('./src/repositories/chunk.repository');
const ChunkingService = require('./src/services/chunking.service');
const GeminiService = require('./src/services/gemini.service');

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env');
    }
    
    // Check Google Key for RAG
    if (!process.env.GOOGLE_API_KEY) {
       console.warn('⚠️  GOOGLE_API_KEY not found. RAG embeddings will NOT be generated.');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // ... (clearing data code remains same) ...

    // Clear existing data
    await Category.deleteMany({});
    await Article.deleteMany({});

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Getting Started', slug: 'getting-started', description: 'Basic setup and introduction', icon: 'Rocket' },
      { name: 'Account Management', slug: 'account-management', description: 'Manage your profile and settings', icon: 'Settings' },
      { name: 'Billing', slug: 'billing', description: 'Subscription and payment queries', icon: 'CreditCard' },
      { name: 'Security', slug: 'security', description: 'Keep your account safe', icon: 'Shield' }
    ]);

    console.log('Categories created');

    // Create Articles
    const articles = [
      {
        title: 'How to Reset Your Password',
        problemStatement: 'Forgot your password or want to change it?',
        content: 'To reset your password, go to the login page and click on forgot password. Follow the instructions sent to your email. Make sure to choose a strong password with at least 8 characters, including numbers and symbols.',
        categoryId: categories[0]._id, // Fixed index
        status: 'published',
        tags: ['account', 'password', 'security'],
        steps: [
          { title: 'Visit Login Page', description: 'Go to the login screen of the application.' },
          { title: 'Click Forgot Password', description: 'Look for the "Forgot Password?" link below the login form.' },
          { title: 'Enter Email', description: 'Provide the email address associated with your account.' },
          { title: 'Check Email', description: 'You will receive a link to reset your password. Click it.' },
          { title: 'Set New Password', description: 'Enter your new password and confirm it.' }
        ],
        troubleshootingTips: 'If you do not receive the email, check your spam folder or try again after 10 minutes.'
      },
      {
        title: 'Updating Your Billing Method',
        problemStatement: 'Need to update your credit card or payment info?',
        content: 'Navigate to the billing section in your account settings. Click on "Update Payment Method" and enter your new card details. We support Visa, Mastercard, and Amex.',
        categoryId: categories[2]._id,
        status: 'published',
        tags: ['billing', 'payment', 'subscription'],
        steps: [
          { title: 'Go to Settings', description: 'Click on your profile icon and select Settings.' },
          { title: 'Select Billing', description: 'Choose the Billing tab from the sidebar.' },
          { title: 'Update Card', description: 'Click on the "Update" button next to your current payment method.' }
        ],
        troubleshootingTips: 'Ensure your card is enabled for international transactions if you are outside the US.'
      }
    ];

    console.log('Creating articles and generating RAG embeddings...');
    let createdCount = 0;

    for (const articleData of articles) {
      const article = new Article(articleData);
      await article.save();
      
      // Generate chunks
      const chunksText = ChunkingService.chunkContent(article.content);
      
      // Generate embeddings for RAG
      const chunksData = [];
      for (const text of chunksText) {
         let embedding = null;
         if (process.env.GOOGLE_API_KEY) {
             try {
                embedding = await GeminiService.generateEmbedding(text);
             } catch (e) {
                console.error('Failed to generate embedding:', e.message);
             }
         }
         chunksData.push({ text, embedding });
      }

      await ChunkRepository.syncChunks(article._id, chunksData, article.status);
      
      createdCount++;
      console.log(`✓ Created article "${article.title}" with ${chunksText.length} chunk(s) & embeddings`);
    }
    
    console.log(`\n✓ Successfully created ${createdCount} articles with chunks`);
    console.log('✓ Seed data complete - chatbot RAG system is ready!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seed();
