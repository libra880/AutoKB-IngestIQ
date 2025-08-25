// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/kb', (req, res) => {
  console.log('✅ Received KB object:', req.body);
  res.status(200).send({ status: 'success', received: true });
});

app.listen(3000, () => {
  console.log('🚀 AutoKB mock API running on http://localhost:3000');
});