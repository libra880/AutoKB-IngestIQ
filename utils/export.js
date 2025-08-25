// utils/export.js
const fetch = require('node-fetch');

async function exportToAutoKB(kbObject, token, apiUrl) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(kbObject)
    });

    const data = await res.json();
    console.log("✅ Export response:", data);
    return data;
  } catch (err) {
    console.error("❌ Export failed:", err.message);
    throw err;
  }
}

module.exports = { exportToAutoKB };