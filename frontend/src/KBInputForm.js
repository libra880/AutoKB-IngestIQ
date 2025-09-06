import React, { useState, useEffect } from 'react';

const KBInputForm = () => {
  const [kbText, setKbText] = useState('');
  const [title, setTitle] = useState('');
  const [product, setProduct] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [question, setQuestion] = useState('');
  const productOptions = [
  'Microsoft Defender for Identity',
  'Microsoft Defender for Cloud Apps',
  'Microsoft Sentinel',
  'Microsoft Purview',
  'Azure AD',
  'Other'
];


  const buttonStyle = {
    backgroundColor: '#0078D4',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  useEffect(() => {
    fetch('/api/kb/all')
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Failed to fetch KBs:', err));
  }, []);

  const resetForm = () => {
    setTitle('');
    setProduct('');
    setSubmittedBy('');
    setKbText('');
    setEditingId(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { kbText, submittedBy, title, product };

    try {
      const res = await fetch('/api/kb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const newEntry = await res.json();
      setEntries(prev => [...prev, newEntry]);
      resetForm();
      setSelectedTitle(newEntry.title);
    } catch (err) {
      console.error('Failed to submit KB:', err);
    }
  };

  const handleSaveEdit = async () => {
    const payload = { kbText, submittedBy, title, product };

    try {
      await fetch(`/api/kb/${encodeURIComponent(editingId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const updatedEntry = {
        ...payload,
        lines: kbText.split('\n').map(line => line.trim()).filter(Boolean),
        id: editingId,
        timestamp: new Date().toISOString()
      };

      setEntries(prev =>
  prev.map(entry => entry.id === editingId ? updatedEntry : entry)

      );

      resetForm();
      setSelectedTitle(updatedEntry.title);
    } catch (err) {
      console.error('Failed to update KB:', err);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      return;
    }

    const results = entries.filter(entry =>
  entry.lines.some(line => line.toLowerCase().includes(term)) ||
  entry.product.toLowerCase().includes(term)
);

    setSearchResults(results);
    setSelectedTitle('');
  };

  const selectedEntry = entries.find(entry =>
    entry.title.trim().toLowerCase() === selectedTitle.trim().toLowerCase()
  );

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setProduct(entry.product);
    setSubmittedBy(entry.submittedBy);
    setKbText(entry.lines.join('\n'));
    setEditingId(entry.id);
    setIsEditing(true);
  };

  const handleDelete = async (idToDelete) => {
    try {
      await fetch(`/api/kb/${encodeURIComponent(idToDelete)}`, {
        method: 'DELETE'
      });
      setEntries(prev => prev.filter(entry => entry.id !== idToDelete));
      setSelectedTitle('');
    } catch (err) {
      console.error('Failed to delete KB:', err);
    }
  };
  
const handleQuestion = () => {
  const term = question.trim().toLowerCase();
  if (!term) {
    setSearchResults([]);
    return;
  }

  // Define stopwords to ignore
  const stopwords = new Set([
    'how', 'do', 'i', 'we', 'you', 'the', 'a', 'an', 'is', 'are', 'was', 'were',
    'to', 'for', 'of', 'on', 'in', 'and', 'or', 'with', 'by', 'at', 'from'
  ]);

  // Define synonym map
  const conceptMap = {
    'false positives': ['alert noise', 'benign triggers', 'non-malicious activity'],
    'ip': ['ip address', 'network entity'],
    'handle': ['triage', 'investigate', 'resolve']
  };

  // Extract keywords
  const rawKeywords = term
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word));

  // Expand keywords with synonyms
  const expandedKeywords = rawKeywords.flatMap(kw => conceptMap[kw] || [kw]);

  // Score entries by keyword match count
  const scoredResults = entries
    .map(entry => {
      const haystack = [
        entry.title.toLowerCase(),
        entry.product.toLowerCase(),
        ...entry.lines.map(line => line.toLowerCase())
      ].join(' ');

      const matchCount = expandedKeywords.filter(kw => haystack.includes(kw)).length;
      return { entry, matchCount };
    })
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(item => item.entry);

  setSearchResults(scoredResults);
  setSelectedTitle('');
};

/* Removed duplicate/incomplete return block to fix syntax error */


  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#E5F1FB'
    }}>
      <img src="/logo.jpg" alt="AutoKB Logo" style={{ height: '88px', marginBottom: '1rem' }} />
      <h2 style={{ color: '#0078D4' }}>
        {isEditing ? '✏️ Edit Knowledge Base Entry' : '📥 Submit a Knowledge Base Entry'}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="KB Title"
          required
          style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
        />
        <select
  value={product}
  onChange={(e) => setProduct(e.target.value)}
  style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
>
  <option value="">Select a product</option>
  {productOptions.map((option, i) => (
    <option key={i} value={option}>{option}</option>
  ))}
</select>
{product === 'Other' && (
  <input
    type="text"
    value={product}
    onChange={(e) => setProduct(e.target.value)}
    placeholder="Enter custom product"
    style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
  />
)}

        <input
          type="text"
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          placeholder="Submitted By"
          style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
        />
        <textarea
          value={kbText}
          onChange={(e) => setKbText(e.target.value)}
          placeholder="Paste KB text here..."
          rows={6}
          required
          style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
        />
        {isEditing ? (
          <>
            <button type="button" onClick={handleSaveEdit} style={buttonStyle}>
              Save Changes
            </button>
            <button type="button" onClick={resetForm} style={{ marginLeft: '1rem' }}>
              Cancel
            </button>
          </>
        ) : (
          <button type="submit" style={buttonStyle}>
            Submit KB
          </button>
        )}
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <h3 style={{ color: '#0078D4' }}>🔍 Search KBs</h3>
      <input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search by keyword"
  style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
/>

      <button onClick={handleSearch} style={{
        backgroundColor: '#107C10',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>Search KBs</button>

      {searchResults.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Search Results:</h4>
          {searchResults.map((entry, i) => (
            <div key={i} style={{
              backgroundColor: '#F3F2F1',
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '6px'
            }}>
              <h4 style={{ color: '#0078D4' }}>{entry.title}</h4>
              <p><strong>Submitted by:</strong> {entry.submittedBy}</p>
              <p><strong>Product:</strong> {entry.product || 'Unspecified'}</p>
              <p style={{ color: '#605E5C' }}><strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
              <ul>
                {entry.lines.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
<hr style={{ margin: '2rem 0' }} />
<h3 style={{ color: '#0078D4' }}>🧠 Ask a Question</h3>
<p style={{ color: '#605E5C', marginBottom: '0.5rem' }}>
  Not sure what to search for? Ask a question and I’ll find relevant KBs.
</p>
<input
  type="text"
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  placeholder="Ask Copilot something..."
  style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
/>
<button
  type="button"
  onClick={handleQuestion}
  style={{
    backgroundColor: '#0078D4',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }}
>
  Ask
</button>

      {searchResults.length === 0 && (
        <>
          <h3 style={{ color: '#0078D4' }}>📘 Select a KB Title</h3>
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
          >
            <option value="">Select a KB Title</option>
            {entries.map((entry, i) => (
              <option key={i} value={entry.title}>
                {entry.title}
              </option>
            ))}
          </select>

          {selectedTitle && selectedEntry && (
            <div style={{
  backgroundColor: '#F3F2F1',
  border: '2px solid #0078D4',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '2rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'    
}}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img src="/logo.jpg" alt="AutoKB Logo" style={{ height: '80px', marginRight: '1rem' }} />
        <h2 style={{ color: '#0078D4', margin: 0 }}>{selectedEntry.title}</h2>
      </div>
      <p><strong style={{ color: '#107C10' }}>Product:</strong> {selectedEntry.product}</p>
      <p><strong>Submitted by:</strong> {selectedEntry.submittedBy}</p>
      <p style={{ color: '#605E5C' }}><strong>Timestamp:</strong> {new Date(selectedEntry.timestamp).toLocaleString()}</p>
      <hr style={{ borderTop: '2px solid #FFB900', margin: '1rem 0' }} />
      <ul style={{ paddingLeft: '1.2rem' }}>
        {selectedEntry.lines.map((line, j) => (
          <li key={j} style={{ marginBottom: '0.5rem' }}>{line}</li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={() => handleEdit(selectedEntry)}
          style={{
            backgroundColor: '#FFB900',
            color: 'black',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(selectedEntry.id)}
          style={{
            backgroundColor: '#D13438',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
              </div>
    </div>
            )}
          </>
        )}
      </div>
    );
  };

  export default KBInputForm;