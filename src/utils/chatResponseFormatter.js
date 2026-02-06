/**
 * Chat Response Formatter
 * Reference: CHAT RESPONSE CONSTRUCTION PROMPT
 */

/**
 * Transforms long-form article content into a structured, chatbot-friendly JSON object.
 * @param {string} articleTitle - The title of the article.
 * @param {string} matchedText - The raw text content of the matched chunk.
 * @returns {Object|null} Structured response object or null if extraction fails.
 */
function formatChatResponse(articleTitle, matchedText) {
  if (!matchedText || matchedText.trim().length === 0) return null;

  const intro = `Here’s what our ${articleTitle} says:`;
  const outro = "If you need more help, you can contact support.";
  
  const sections = [];
  const lines = matchedText.split(/\n/);
  
  let currentSection = { title: "Details", points: [] };
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Rule: Prefer explicit headings if present.
    // Heuristic: Short line (< 50 chars), doesn't end with a period/question mark.
    const isHeading = line.length < 50 && !/[.!?:]$/.test(line);

    if (isHeading) {
      if (currentSection.points.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: line, points: [] };
    } else {
      // Split into bullets by symbols, sentence boundaries, or new lines.
      // We also handle existing punctuation better.
      const bulletCandidates = line.split(/[•\n]|(?<=[.!?])\s+/);
      
      for (let point of bulletCandidates) {
        point = point.trim()
          .replace(/^[•\-\*]\s*/, "") // Remove existing bullets
          .replace(/\s+/g, " "); // Normalize whitespace
          
        if (point.length > 5) {
          if (currentSection.points.length < 6) {
            currentSection.points.push(point);
          }
        }
      }
    }
  }
  
  if (currentSection.points.length > 0) {
    sections.push(currentSection);
  }

  // Fallback Rule: If no clean sections can be formed -> return null
  if (sections.length === 0) return null;

  // Limit output to ~150-200 words total.
  // We'll take the first 4 sections max as per target format (2-4 paragraphs).
  const limitedSections = sections.slice(0, 4);
  
  let wordCount = intro.split(/\s+/).length + outro.split(/\s+/).length;
  const filteredSections = [];
  
  for (const section of limitedSections) {
    const sectionTitleWords = section.title.split(/\s+/).length;
    let sectionPoints = [];
    
    for (const point of section.points) {
      const pointWords = point.split(/\s+/).length;
      if (wordCount + pointWords + sectionTitleWords <= 200) {
        sectionPoints.push(point);
        wordCount += pointWords;
      } else {
        break;
      }
    }
    
    if (sectionPoints.length > 0) {
      filteredSections.push({
        title: section.title,
        points: sectionPoints
      });
      wordCount += sectionTitleWords;
    }
    
    if (wordCount >= 200) break;
  }

  if (filteredSections.length === 0) return null;

  return {
    intro,
    sections: filteredSections,
    outro
  };
}

module.exports = { formatChatResponse };
