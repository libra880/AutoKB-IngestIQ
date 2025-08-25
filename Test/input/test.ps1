Write-Host "🧪 Running AutoKB IngestIQ CLI tests..."

# Set paths
$SOURCE_SINGLE = "./kb/fix-sync.md"
$SOURCE_BATCH = "./kb"
$OUTDIR = "./output"
$FORMAT = "markdown-preview"
$TITLE = "HackathonTest"
$TAGS = "identity,sync,preview"

# Test single file ingestion
Write-Host "🔹 Testing single file ingestion..."
node utils/run.js --source $SOURCE_SINGLE --outdir $OUTDIR --format $FORMAT --title $TITLE --tags $TAGS

# Test batch ingestion
Write-Host "🔹 Testing batch ingestion..."
node utils/run.js --source $SOURCE_BATCH --batch --outdir $OUTDIR --format $FORMAT --title $TITLE --tags $TAGS

Write-Host "✅ All tests completed."