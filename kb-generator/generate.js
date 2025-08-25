function generateKB(parsed) {
  return `
# ${parsed['Product']} – Case ${parsed['Case ID']}

## 🧩 Issue Description
${parsed['Issue Description']}

## 🛠 Troubleshooting Steps
${parsed['Troubleshooting Steps'].map(step => step.startsWith('- ') ? step : `- ${step}`).join('\n')}

## ✅ Resolution
${parsed['Resolution']}

## 🏷 Tags
${parsed['Tags'].map(tag => `- ${tag}`).join('\n')}
  `.trim();
}

module.exports = generateKB;