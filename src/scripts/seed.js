const mongoose = require('mongoose');
const ArticleRepository = require('../repositories/article.repository');
const Article = require('../models/article.model');
const ArticleChunk = require('../models/articleChunk.model');
const AuditLog = require('../models/auditLog.model');
const Ticket = require('../models/ticket.model');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const articles = [
  {
    title: "Detailed Refund Policy",
    category: "Payments",
    tags: ["refund", "payment", "policy"],
    status: "published",
    content: `Eligibility for Refunds
Our service offers refunds under specific conditions to ensure fairness. You are eligible for a full refund if you have purchased a subscription within the last 7 days and have not initiated any service requests or used more than 5% of your allocated credits. This period is strictly enforced to maintain our service quality.

Refund Process
To request a refund, you must log in to your account dashboard, navigate to the billing section, and click on 'Request Refund'. You will be asked to provide a brief reason for the request. Once submitted, our team will review the request within 2-3 business days. If approved, the funds will be returned to your original payment method within 5-10 business days depending on your bank.

Non-Refundable Items
Certain items and services are strictly non-refundable. These include one-time setup fees, consultation hours already delivered, and any third-party integration costs. Additionally, once a subscription has been active for more than 7 days, it becomes non-refundable for the current billing cycle, though you may cancel to prevent future charges.

Exceptions and Disputes
We understand that extraordinary circumstances occur. If you have experienced a technical failure on our part that prevented you from using the service, please contact our support team directly. We handle these cases on an individual basis and may offer partial refunds or account credits at our discretion. Disputing a charge through your bank without contacting us first will result in immediate account suspension.`
  },
  {
    title: "Account Management and Deletion",
    category: "Account",
    tags: ["account", "delete", "privacy", "security"],
    status: "published",
    content: `Managing Your Account Settings
Users can update their profile information, including email address, display name, and notification preferences, through the account settings page. Keeping your information accurate helps us provide better support and ensures you receive important security updates. We recommend enabling two-factor authentication for enhanced security.

Security Best Practices
To keep your account safe, never share your password with anyone. Our support team will never ask for your password. Use a unique password for our service and consider using a password manager. If you suspect your account has been compromised, use the 'Reset Password' link on the login page immediately and notify our security team.

Process for Account Deletion
If you wish to terminate your relationship with our service, you can request account deletion. This process is permanent and cannot be reversed. To start the process, go to 'Account Settings', scroll to the bottom, and select 'Delete Account'. You will be required to confirm your password and enter a verification code sent to your email.

Data Retention After Deletion
Upon account deletion, your personal profile information is removed from our active databases within 24 hours. However, some data may persist in our encrypted backups for up to 30 days. Furthermore, we are legally required to retain billing records and transaction history for up to 7 years for tax and audit purposes. This data is stored in a separate, secure archive.`
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is missing');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Clear all related collections
    await Article.deleteMany({});
    await ArticleChunk.deleteMany({});
    await AuditLog.deleteMany({});
    await Ticket.deleteMany({});
    console.log('Cleared existing data');

    // Create via Repository to trigger chunking
    for (const articleData of articles) {
      await ArticleRepository.createArticle(articleData);
    }
    console.log('Seed data inserted with chunking');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
