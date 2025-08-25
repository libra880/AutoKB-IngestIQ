#!/bin/bash

echo "🧪 Running AutoKB IngestIQ CLI tests..."

# Set paths
SOURCE_SINGLE="../../kb/fix-sync.md"   # just the path
SOURCE_BATCH="../../kb"               # just the path
OUTDIR="./output"
FORMAT="markdown-preview"
TITLE="HackathonTest"
TAGS="identity,sync,preview"

# Test single file ingestion
echo "🔹 Testing single file ingestion..."
node ../../utils/run.js \
  --source "$SOURCE_SINGLE" \
  --outdir "$OUTDIR" \
  --format "$FORMAT" \
  --title "$TITLE" \
  --tags "$TAGS"

# Test batch ingestion
echo "🔹 Testing batch ingestion..."
node ../../utils/run.js \
  --source "$SOURCE_BATCH" \
  --batch \
  --outdir "$OUTDIR" \
  --format "$FORMAT" \
  --title "$TITLE" \
  --tags "$TAGS"

echo "✅ All tests completed."