const fs = require('fs');
const path = require('path');
const validate = require('./validate');
const generateKB = require('../kb-generator/generate');

const filePath = path.join(__dirname, '../docs/summary-template.md');
const rawText = fs.readFileSync(filePath, 'utf-8');

// Parse logic
const sections = rawText.split(/^## /gm);
const parsed = {};

sections.forEach(section => {
  if (section.startsWith('Case Metadata')) {
    const lines = section.split('\n');
    lines.forEach(line => {
      const match = line.match(/\*\*(.+?)\*\*: (.*)/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        parsed[key] = value;
      }
    });
  } else if (section.startsWith('Issue Description')) {
    parsed['Issue Description'] = section.split('\n').slice(1).join('\n').trim();
  } else if (section.startsWith('Troubleshooting Steps')) {
    parsed['Troubleshooting Steps'] = section.match(/- .+/g) || [];
  } else if (section.startsWith('Resolution')) {
    parsed['Resolution'] = section.split('\n').slice(1).join('\n').trim();
  } else if (section.startsWith('Tags')) {
    parsed['Tags'] = section.match(/\[ \] (.+)/g)?.map(tag => tag.replace('[ ] ', '').trim()) || [];
  }
});

// ✅ Now validate
const issues = validate(parsed);
if (issues.length > 0) {
  console.warn('Validation issues found:');
  issues.forEach(issue => console.warn('- ' + issue));
} else {
  console.log('✅ All fields look good.');
}

// ✅ Then generate KB
const kbArticle = generateKB(parsed);
fs.writeFileSync(path.join(__dirname, '../output/kb-article.md'), kbArticle);
console.log('✅ KB article generated at output/kb-article.md');



console.log(parsed);