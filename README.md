# MindWise Health Support Chatbot - Backend

A healthcare support chatbot backend powered by RAG (Retrieval-Augmented Generation) using Google Gemini AI and MongoDB.

## Features

- 🤖 **AI-Powered Chatbot**: Uses Google Gemini for embeddings and completions
- 📚 **Knowledge Base**: Healthcare articles with semantic search
- 🎫 **Ticket Management**: Support ticket creation and tracking
- 👥 **User Authentication**: JWT-based auth with role-based access control
- 📊 **Analytics**: Track deflection rates, search patterns, and user engagement
- 🔒 **Security**: Rate limiting, input validation, and secure password hashing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Generative AI (Gemini)
- **Authentication**: JWT + bcrypt

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key (optional)
PORT=3000
NODE_ENV=production
```

## Installation

```bash
# Install dependencies
npm install

# Seed healthcare articles (first time only)
node seed-healthcare-articles.js

# Start the server
npm start
```

## API Endpoints

### Public Endpoints
- `POST /api/chat/query` - Chat with the AI assistant
- `GET /api/kb/articles` - Get published articles
- `GET /api/kb/articles/:slug` - Get article by slug
- `POST /api/kb/search` - Search articles
- `GET /api/kb/categories` - Get all categories

### Protected Endpoints (Require Authentication)
- `POST /api/tickets` - Create support ticket
- `GET /api/tickets` - Get user's tickets
- `GET /api/tickets/:id` - Get ticket details

### Admin Endpoints (Require Admin Role)
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/:id` - Update article
- `DELETE /api/admin/articles/:id` - Delete article
- `GET /api/admin/tickets` - Get all tickets
- `GET /api/admin/analytics` - Get analytics data

## Project Structure

```
src/
├── config/          # Database and configuration
├── controllers/     # Route controllers
├── engines/         # Answer resolution engine
├── middlewares/     # Auth, rate limiting, validation
├── models/          # Mongoose schemas
├── repositories/    # Data access layer
├── routes/          # API routes
├── services/        # Business logic (AI, chat, vector)
└── utils/           # Helper functions
```

## Deployment

### Render (Recommended)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build and start
npm start
```

## CI/CD

GitHub Actions workflow automatically:
- Runs tests on push/PR
- Triggers Render deployment after tests pass

## Healthcare Articles

The system includes 15+ healthcare articles covering:
- Appointments (scheduling, rescheduling, canceling)
- Prescriptions (refills, pharmacy information)
- Insurance & Billing (coverage, payments, plans)
- Test Results (lab results, imaging)
- Telehealth (video visits, virtual consultations)
- General Health (chronic conditions, mental health, vaccinations)

## License

ISC

## Support

For issues or questions, please create a support ticket through the application.
