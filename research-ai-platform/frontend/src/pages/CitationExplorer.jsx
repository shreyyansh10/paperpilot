import { useState } from 'react'
import axios from 'axios'

export default function CitationExplorer() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    setSearched(true)

    try {
      const response = await axios.post(
        'http://localhost:8000/citations/search',
        { query: query.trim(), limit: 10 }
      )
      setResults(response.data.papers || [])
    } catch (err) {
      setError('Failed to fetch results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <>
      <div className="citation-explorer">
        <div className="page-header">
          <h1>🔗 Citation Explorer</h1>
          <p>Search for any research paper to discover citations and related works</p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter paper title or keywords... e.g. 'Attention is All You Need'"
              className="search-input"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="search-btn"
            >
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching academic papers...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            ❌ {error}
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div className="empty-state">
            <p>No papers found for "{query}". Try different keywords.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-section">
            <p className="results-count">
              Found {results.length} papers for "{query}"
            </p>
            <div className="papers-grid">
              {results.map((paper, index) => (
                <div key={index} className="paper-card">
                  <div className="paper-header">
                    <h3 className="paper-title">
                      {paper.title}
                    </h3>
                    <span className="citation-badge">
                      📊 {paper.citation_count?.toLocaleString() || 0} citations
                    </span>
                  </div>

                  <div className="paper-meta">
                    <span className="authors">
                      👥 {paper.authors?.join(', ') || 'Unknown authors'}
                    </span>
                    <span className="year">
                      📅 {paper.year || 'N/A'}
                    </span>
                    {paper.venue && (
                      <span className="venue">
                        🏛️ {paper.venue}
                      </span>
                    )}
                  </div>

                  <p className="abstract">
                    {paper.abstract}
                  </p>

                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View Paper →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .citation-explorer { max-width: 1000px; margin: 0 auto; padding: 32px 40px; height: calc(100vh - 80px); display: flex; flex-direction: column; box-sizing: border-box; }
        .page-header { text-align: center; margin-bottom: 24px; flex-shrink: 0; }
        .page-header h1 { font-size: 32px; color: var(--text-primary); margin: 0 0 8px 0; font-weight: 700; }
        .page-header p { color: var(--text-muted); margin: 0; font-size: 16px; }
        .search-section { flex-shrink: 0; margin-bottom: 24px; }
        .search-bar { display: flex; gap: 12px; }
        .search-input { flex: 1; padding: 14px 18px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-primary); font-size: 15px; outline: none; }
        .search-input:focus { border-color: var(--accent); }
        .search-btn { padding: 14px 24px; background: var(--accent); border: none; border-radius: 10px; color: #fff; font-size: 15px; cursor: pointer; white-space: nowrap; font-weight: 600; }
        .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .loading-state { text-align: center; padding: 40px; color: var(--text-muted); }
        .spinner { width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-box { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; border-radius: 10px; padding: 16px; color: #ef4444; margin-bottom: 20px; }
        .empty-state { text-align: center; padding: 40px; color: var(--text-muted); font-size: 16px; }
        .results-section { flex: 1; overflow-y: auto; padding-right: 12px; min-height: 0; }
        .results-count { color: var(--text-muted); margin-bottom: 20px; font-size: 16px; position: sticky; top: 0; background: var(--bg-primary); padding-bottom: 8px; z-index: 10; font-weight: 500; }
        .papers-grid { display: flex; flex-direction: column; gap: 16px; }
        .paper-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; transition: border-color 0.2s; }
        .paper-card:hover { border-color: var(--accent); }
        .paper-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
        .paper-title { color: var(--text-primary); font-size: 17px; font-weight: 600; line-height: 1.4; flex: 1; }
        .citation-badge { background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 13px; white-space: nowrap; }
        .paper-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
        .paper-meta span { color: var(--text-muted); font-size: 14px; }
        .abstract { color: var(--text-secondary); font-size: 15px; line-height: 1.6; margin-bottom: 16px; }
        .view-btn { display: inline-block; padding: 10px 24px; background: var(--accent); color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; }
        .view-btn:hover { opacity: 0.9; }
      `}</style>
    </>
  )
}
