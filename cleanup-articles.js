/**
 * Cleanup Script - Remove non-healthcare articles
 * Keeps only healthcare-relevant articles
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Article = require('./src/models/article.model');
const Chunk = require('./src/models/articleChunk.model');
const Category = require('./src/models/category.model');

// Healthcare article titles to KEEP
const healthcareArticleTitles = [
  'How to Schedule an Appointment',
  'How to Reschedule or Cancel an Appointment',
  'How to Refill a Prescription',
  'How to View My Lab Results',
  'How to Start a Telehealth Visit',
  'Understanding Your Insurance Coverage',
  'How to Pay My Bill Online',
  'What to Do in a Medical Emergency',
  'How to Access My Medical Records',
  'How to Update My Personal Information',
  'Preparing for Your First Visit',
  'Managing Chronic Conditions',
  'Mental Health Resources and Support',
  'COVID-19, Flu, and Vaccination Information',
  'Specialist Referrals: How They Work',
  'How to Reset Your Password',
  'Updating Your Billing Method'
];

// Non-healthcare keywords - articles containing these will be removed
const nonHealthcareKeywords = [
  'API', 'OAuth', 'SDK', 'webhook', 'ETL', 'JWT', 'cache', 
  'microservices', 'encryption', 'indexing', 'database', 'normalization',
  'SharePoint', 'GSuite', 'CSV', 'audit', 'cluster', 'gateway',
  'onboarding', 'billing cycle', 'data cleanup', 'load balancing',
  'Auto-scaling', 'Two-factor', 'User roles', 'Custom reports',
  'System admins', 'HR managers', 'Marketing teams', 'Desktop client',
  'Mobile app', 'SecureGate', 'FlowManager', 'MindWise Connect',
  'Sync mismatch', 'Slow performance', 'Login fail', 'Legacy v1',
  'Production cluster', 'Local dev', 'Client portals', 'Payment gateway',
  '#' // Remove numbered test articles
];

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot');
    console.log('✅ Connected to MongoDB\n');

    // Get all articles
    const allArticles = await Article.find({});
    console.log(`📊 Total articles before cleanup: ${allArticles.length}\n`);

    const articlesToRemove = [];
    const articlesToKeep = [];

    for (const article of allArticles) {
      const title = article.title;
      
      // Check if it's a healthcare article we want to keep
      const isHealthcare = healthcareArticleTitles.some(ht => 
        title.toLowerCase().includes(ht.toLowerCase()) || ht.toLowerCase().includes(title.toLowerCase())
      );

      // Check if it contains non-healthcare keywords
      const hasNonHealthcareKeyword = nonHealthcareKeywords.some(keyword =>
        title.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isHealthcare && !hasNonHealthcareKeyword) {
        articlesToKeep.push(article);
      } else {
        articlesToRemove.push(article);
      }
    }

    console.log(`🗑️  Articles to remove: ${articlesToRemove.length}`);
    console.log(`✅ Articles to keep: ${articlesToKeep.length}\n`);

    // Remove non-healthcare articles
    if (articlesToRemove.length > 0) {
      const idsToRemove = articlesToRemove.map(a => a._id);
      
      console.log('Removing articles:');
      articlesToRemove.forEach(a => console.log(`  - ${a.title}`));
      
      await Article.deleteMany({ _id: { $in: idsToRemove } });
      await Chunk.deleteMany({ articleId: { $in: idsToRemove } });
      
      console.log(`\n✅ Removed ${articlesToRemove.length} non-healthcare articles`);
    }

    // Remove non-healthcare categories
    console.log('\n🧹 Cleaning up categories...');
    const healthcareCategories = ['General Health', 'Appointments', 'Prescriptions', 'Insurance & Billing', 'Test Results', 'Telehealth', 'Account Management', 'Billing', 'Getting Started', 'Security'];
    
    // Final summary
    const remainingArticles = await Article.find({ status: 'published' });
    const remainingCategories = await Category.find({});
    
    console.log('\n================================================');
    console.log('  FINAL SUMMARY');
    console.log('================================================');
    console.log(`\n✅ Published Articles: ${remainingArticles.length}`);
    remainingArticles.forEach(a => console.log(`  • ${a.title}`));
    console.log(`\n📁 Categories: ${remainingCategories.length}`);
    remainingCategories.forEach(c => console.log(`  • ${c.name}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
}

main();
