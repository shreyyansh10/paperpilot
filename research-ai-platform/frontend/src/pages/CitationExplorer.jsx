import { useState } from 'react';
import { getCitations } from '../api/client';
import './CitationExplorer.css';

export default function CitationExplorer() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getCitations(query);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch citations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="citation-page">
      <div className="citation-header">
        <h1>🔗 Citation Explorer</h1>
        <p>Search for a paper to discover its citations and related works.</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter paper title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? '⏳' : '🔍'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {data && !data.found && (
        <div className="empty-state">No papers found for "{query}".</div>
      )}

      {data?.found && (
        <div className="citation-results">
          <div className="main-paper">
            <h2>{data.paper?.title}</h2>
            <p className="paper-meta">
              {data.paper?.year} · {data.paper?.citationCount} citations
            </p>
            {data.paper?.abstract && <p className="paper-abstract">{data.paper.abstract}</p>}
          </div>

          {data.citations?.length > 0 && (
            <div className="citation-section">
              <h3>📥 Cited By ({data.citations.length})</h3>
              <ul>
                {data.citations.map((c, i) => (
                  <li key={i}>
                    <strong>{c.title || 'Untitled'}</strong>
                    {c.year && <span className="year"> ({c.year})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.related_papers?.length > 0 && (
            <div className="citation-section">
              <h3>📤 References ({data.related_papers.length})</h3>
              <ul>
                {data.related_papers.map((r, i) => (
                  <li key={i}>
                    <strong>{r.title || 'Untitled'}</strong>
                    {r.year && <span className="year"> ({r.year})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
