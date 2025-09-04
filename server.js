const express = require('express');
const app = express();
const PORT = 5000;
const fs = require('fs');
const path = require('path');

app.use(express.json());

// ✅ GET route — fetch all KBs
app.get('/api/kb/all', (req, res) => {
  const filePath = path.join(__dirname, 'kb-log.json');
  if (!fs.existsSync(filePath)) return res.send([]);
  const data = JSON.parse(fs.readFileSync(filePath));
  res.send(data);
});

// ✅ POST route — ingest new KB
const crypto = require('crypto');

app.post('/api/kb', (req, res) => {
  const { kbText, submittedBy, title: incomingTitle, product } = req.body;
  const filePath = path.join(__dirname, 'kb-log.json');

  if (!kbText) {
    return res.status(400).send({ error: 'kbText is required' });
  }

  const lines = kbText.split('\n').map(line => line.trim()).filter(Boolean);
  const title = incomingTitle && incomingTitle.trim() !== '' ? incomingTitle : lines[0] || 'Untitled KB';
  const id = crypto.randomUUID();

  const newEntry = {
    id,
    title,
    product: product || 'Unspecified',
    lines,
    submittedBy: submittedBy || 'Unknown',
    timestamp: new Date().toISOString()
  };

  try {
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];

    existing.push(newEntry);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    console.log('✅ KB saved to kb-log.json');
    res.status(200).send(newEntry);
  } catch (err) {
    console.error('❌ Failed to write KB file:', err);
    res.status(500).send({ error: 'Write failed' });
  }
});
app.delete('/api/kb/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'kb-log.json');

  try {
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];

    const updated = existing.filter(entry => entry.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    res.status(200).send({ message: 'KB deleted' });
  } catch (err) {
    console.error('❌ Failed to delete KB:', err);
    res.status(500).send({ error: 'Delete failed' });
  }
});
app.put('/api/kb/:id', (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  const filePath = path.join(__dirname, 'kb-log.json');

  try {
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];

    const updated = existing.map(entry =>
      entry.id === id
        ? {
            ...entry,
            ...updatedFields,
            lines: updatedFields.kbText.split('\n').map(line => line.trim()).filter(Boolean),
            timestamp: new Date().toISOString()
          }
        : entry
    );

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    res.status(200).send(updated.find(entry => entry.id === id));
  } catch (err) {
    console.error('❌ Failed to update KB:', err);
    res.status(500).send({ error: 'Update failed' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 AutoKB-IngestIQ backend running on http://localhost:${PORT}`);
});