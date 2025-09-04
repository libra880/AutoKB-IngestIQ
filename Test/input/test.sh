#!/bin/bash
echo "🧪 Running AutoKB IngestIQ CLI tests..."

# Move to the project root
cd "$(dirname "$0")/../../"

echo "🔹 Testing single file ingestion..."
node utils/run.js --source kb/sample.md --format markdown-preview

echo "🔹 Testing batch ingestion..."
node utils/run.js --source kb/ --format markdown-preview --export api

echo "✅ All tests completed."
