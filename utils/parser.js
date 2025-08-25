
 // utils/parser.js
const fs = require('fs');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

function parseMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const hasFrontmatter = Object.keys(data).length > 0;

  if (hasFrontmatter) {
    const kbObject = {
      title: data.title || 'Untitled KB',
      summary: data.summary || '',
      tags: data.tags || [],
      content: md.render(content)
    };
    return kbObject;
  } else {
    const sections = raw.split(/^---$/gm);
    const parsedSections = sections.map(parseSection).filter(p => p.title);
    return parsedSections.map(generateKBObject);
  }
}

module.exports = { parseMarkdownFile };

function parseSection(markdown) {
  const { data: frontmatter, content } = matter(markdown);

  return {
    ...frontmatter,
    content: content.trim()
  };
}


function validate(parsed) {
  const issues = [];

  // Normalize keys to lowercase for safety
  const normalized = Object.fromEntries(
    Object.entries(parsed).map(([key, val]) => [key.toLowerCase(), val])
  );

  const requiredFields = {
    title: 'Missing title',
    product: 'Missing product',
    environment: 'Missing environment',
    severity: 'Missing severity',
    issue: 'Missing issue description',
    troubleshooting: 'Missing troubleshooting steps',
    resolution: 'Missing resolution',
    tags: 'No tags found'
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (field === 'tags') {
      if (!Array.isArray(normalized.tags) || normalized.tags.length === 0) {
        issues.push(message);
      }
    } else {
      if (!normalized[field]) {
        issues.push(message);
      }
    }
  }

  return issues;

}

function generateKBObject(parsed) {
  return {
    title: parsed.title,
    summary: parsed.summary,
    product: parsed.product,
    environment: parsed.environment,
    severity: parsed.severity,
    issue: parsed.issue,
    troubleshooting: parsed.troubleshooting,
    resolution: parsed.resolution,
    tags: parsed.tags,
    content: parsed.content
  };
}
function extractSections(markdown) {
  return markdown
    .split(/^---$/gm)
    .map(section => {
      const parsed = parseSection(section);
      console.log('🔍 Parsed section:', parsed);
      return parsed && typeof parsed === 'object' ? parsed : {};
    })
    .filter(parsed => parsed.title && parsed.title.trim() !== '');
}

module.exports = {
  parseMarkdownFile,
  parseSection,
  validate,
  generateKBObject,
  extractSections
};
