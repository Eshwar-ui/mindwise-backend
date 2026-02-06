/**
 * Tests for Answer Resolution Engine
 * Follows MANDATORY TEST CASES from TDD Prompt
 */

const Engine = require('../../src/engines/answerResolution/engine');

const mockArticles = [
  {
    id: '1',
    title: 'Refund Policy',
    content: 'All sales are final. We do not offer refunds.',
    status: 'published',
    updatedAt: new Date('2026-01-01')
  },
  {
    id: '2',
    title: 'How to create a ticket',
    content: 'To create a support ticket, click on the "Raise Support Ticket" button.',
    status: 'published',
    updatedAt: new Date('2026-01-05')
  },
  {
    id: '3',
    title: 'Newer Ticket Guide',
    content: 'To create a support ticket, click on the "Raise Support Ticket" button.',
    status: 'published',
    updatedAt: new Date('2026-01-10')
  },
  {
    id: '4',
    title: 'Draft Article',
    content: 'This should be ignored.',
    status: 'draft',
    updatedAt: new Date('2026-01-15')
  }
];

describe('AnswerResolutionEngine', () => {
  // 1. Exact article match
  test('Exact article match should return answer', () => {
    const query = 'Refund Policy';
    const result = Engine.resolve(query, mockArticles);
    expect(result.type).toBe('answer');
    expect(result.articleId).toBe('1');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.5);
  });

  // 2. Partial match below threshold
  test('Partial match below threshold should return fallback', () => {
    const query = 'something unrelated about weather';
    const result = Engine.resolve(query, mockArticles);
    expect(result.type).toBe('fallback');
    expect(result.message).toContain('Would you like to raise a support ticket?');
  });

  // 3. No articles available
  test('No articles available should return fallback', () => {
    const result = Engine.resolve('any query', []);
    expect(result.type).toBe('fallback');
  });

  // 4. Multiple articles (Highest score wins)
  test('Highest score wins among multiple articles', () => {
    const query = 'Refund';
    const result = Engine.resolve(query, mockArticles);
    expect(result.type).toBe('answer');
    expect(result.articleId).toBe('1');
  });

  // 5. Equal confidence scores (Newer article preferred)
  test('Newer article preferred for equal confidence scores', () => {
    // Both Article 2 and 3 have the same content overlap for this query
    const query = 'create a support ticket';
    const result = Engine.resolve(query, mockArticles);
    expect(result.type).toBe('answer');
    // Article 3 is newer (Jan 10) than Article 2 (Jan 5)
    expect(result.articleId).toBe('3');
  });

  // 6. Empty question
  test('Empty question should return fallback', () => {
    const result = Engine.resolve('', mockArticles);
    expect(result.type).toBe('fallback');
  });

  // 7. Draft articles (Must NEVER be considered)
  test('Draft articles must be ignored', () => {
    const query = 'Draft Article';
    const result = Engine.resolve(query, mockArticles);
    // Even if it matches exactly, it's draft, so fallback
    expect(result.type).toBe('fallback');
  });
});
