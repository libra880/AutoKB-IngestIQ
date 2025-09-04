const fs = require('fs');
const path = require('path');

const entry = {
  title: "Event ID 4662",
  lines: ["Directory service object access detected."],
  submittedBy: "Shalonda",
  timestamp: new Date().toISOString()
};

const filePath = path.join(__dirname, 'kb-log.json');

try {
  const existing = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  existing.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log('✅ File written successfully');
} catch (err) {
  console.error('❌ Write failed:', err);
}