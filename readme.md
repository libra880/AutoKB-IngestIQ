# 🧠 AutoKB-IngestIQ CLI

A modular, override-safe CLI for ingesting markdown-based knowledge into AutoKB pipelines. Designed for hackathon agility, batch processing, and scalable onboarding.

---

## 🚀 Features

- 🔧 Modular CLI structure with override-safe logic  
- 📦 Batch ingestion of markdown files from `/kb`  
- 🧪 Built-in test script for validation  
- 📁 Output generation to `/output`  
- 🛡️ `.gitignore` and `.env` support for clean commits  
- 📚 Clear onboarding artifacts for rapid collaboration  

---

## 📦 Installation

```bash
git clone https://github.com/your-org/AutoKB-IngestIQ.git
cd AutoKB-IngestIQ
npm install

AUTOKB-INGESTIQ/
├── kb/                  # Markdown source files
│   ├── sample.md
│   └── kb-generator/
├── output/              # Generated KB output
│   ├── batch/
│   └── test/
│       ├── example-case.json
│       ├── example-case.yaml
│       ├── kb-article.md
│       └── sensor-failure.json
├── parser-engine/       # Parsing logic
├── pilot-cases/         # Example or edge case inputs
├── utils/               # CLI logic
│   ├── export.js
│   ├── parser.js
│   └── run.js
├── versioning/          # Schema or logic version tracking
├── .env                 # Secrets and config
├── .gitignore           # Clean commit rules
├── package.json         # Project metadata
├── package-lock.json
├── server.js            # Optional backend/API
├── test.ps1             # PowerShell validation
├── test.sh              # Bash validation
