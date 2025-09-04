const fs = require('fs');
const path = require('path');
const kbPath = path.join(__dirname, '..', 'kb'); // Adjust depth as needed
const yaml = require('js-yaml');
const minimist = require('minimist');
const { parseSection, validate, generateKBObject, parseMarkdownFile } = require('./parser');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const args = minimist(process.argv.slice(2));
const outdir = args.outdir || path.join(__dirname, '../output');
const sourcePath = args.source
  ? path.resolve(process.cwd(), args.source)
  : path.join(__dirname, '..', 'kb'); // fallback to project-root/kb
const format = args.format || 'json';
const overrides = {
  title: args.title,
  tags: args.tags?.split(',').map(t => t.trim())
  
};
const isBatch = args.batch;
const isDirectory = sourcePath && fs.existsSync(sourcePath) && fs.lstatSync(sourcePath).isDirectory();

// 🔐 Debug: Environment
console.log("🔐 Token:", process.env.AUTOKB_TOKEN);
console.log("🌐 API URL:", process.env.AUTOKB_API_URL);

// 🛠 Ensure output directory exists
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir, { recursive: true });
}

// 🚨 Validate source path
if (!sourcePath) {
  console.error('❌ Missing --source argument');
  process.exit(1);
}
if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Source path not found: ${sourcePath}`);
  process.exit(1);
}



// 🚀 Stub: Export function
function exportToAutoKB(kb) {
  const payload = JSON.stringify(kb);
  console.log("🚀 Stub: would export KB to AutoKB API:", kb.title);
  // You can wire in actual POST logic here later
}

// 📦 Batch ingestion flow
if (isBatch || isDirectory) {
  const entries = fs.readdirSync(sourcePath);
  
  const files = entries
    .map(entry => path.join(sourcePath, entry))
    .filter(file => fs.lstatSync(file).isFile() && file.endsWith('.md'));

  files.forEach(file => {
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = parseSection(raw);

    parsed.title = overrides.title
      ? `${overrides.title}-${path.basename(file, '.md')}`
      : parsed.title || path.basename(file, '.md');

    if (overrides.tags) parsed.tags = overrides.tags;

    const issues = validate(parsed);
    if (issues.length) {
      console.warn(`⚠️ Skipping ${file} due to validation issues:`, issues.join(', '));
      return;
    }

    const kb = generateKBObject(parsed);
    const filename = parsed.title.toLowerCase().replace(/\s+/g, '-') + '.' + format;
    const outputPath = path.join(outdir, filename);

    let output;
    switch (format) {
      case 'yaml':
        output = yaml.dump(kb);
        break;
      case 'markdown-preview':
        output = `# ${kb.title}\n\n**Summary:** ${kb.summary}\n\n---\n\n${kb.content}`;
        break;
      default:
        output = JSON.stringify(kb, null, 2);
    }

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const timestampedPath = path.join(outdir, `hackathontest-sample-${timestamp}.markdowndown`);


fs.writeFileSync(timestampedPath, output);
console.log(`✅ KB article written to ${timestampedPath}`);
exportToAutoKB(kb);


  });
}

// 📄 Single file ingestion flow
// 📄 Single file ingestion flow
else {
  const markdown = fs.readFileSync(sourcePath, 'utf-8');
  const parsed = parseSection(markdown);

  if (overrides.title) parsed.title = overrides.title;
  if (overrides.tags) parsed.tags = overrides.tags;

  const issues = validate(parsed);
  if (issues.length) {
    console.warn(`⚠️ Validation issues:`, issues.join(', '));
    process.exit(1);
  }

  const kb = generateKBObject(parsed);

  let output;
  switch (format) {
    case 'yaml':
      output = yaml.dump(kb);
      break;
    case 'markdown-preview':
      output = `# ${kb.title}\n\n**Summary:** ${kb.summary}\n\n---\n\n${kb.content}`;
      break;
    default:
      output = JSON.stringify(kb, null, 2);
  }

  // ✅ Timestamped output path
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFilename = `hackathontest-single-${timestamp}.markdowndown`;
  const outputPath = path.join(outdir, outputFilename);

  fs.writeFileSync(outputPath, output);
  console.log(`✅ KB article written to ${outputPath}`);
  exportToAutoKB(kb);
}



