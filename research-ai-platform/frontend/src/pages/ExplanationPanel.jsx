import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../contexts/PaperContext';
import { summarizePaper, explainPaper } from '../api/client';
import './ExplanationPanel.css';

const LEVELS = ['beginner', 'intermediate', 'expert'];
const LEVEL_ICONS = { beginner: '🟢', intermediate: '🟡', expert: '🔴' };

export default function ExplanationPanel() {
  const { paperId, filename } = usePaper();
  const navigate = useNavigate();

  // Summary state
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Explanation state
  const [level, setLevel] = useState('beginner');
  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);

  const handleSummarize = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const response = await summarizePaper(paperId);
      setSummary(response.data.summary || response.data.text || JSON.stringify(response.data));
    } catch (err) {
      setSummaryError(err.response?.data?.detail || 'Failed to generate summary.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleExplain = async () => {
    setExplanationLoading(true);
    setExplanationError(null);
    try {
      const response = await explainPaper(paperId, '', level);
      setExplanation(response.data.explanation || response.data.text || JSON.stringify(response.data));
    } catch (err) {
      setExplanationError(err.response?.data?.detail || 'Failed to generate explanation.');
    } finally {
      setExplanationLoading(false);
    }
  };

  // No paper uploaded — show warning
  if (!paperId) {
    return (
      <div className="explanation-page">
        <div className="no-paper-card">
          <span className="no-paper-icon">⚠️</span>
          <h2>No paper uploaded yet</h2>
          <p>Please go to the Upload page first to upload a research paper.</p>
          <button className="explain-btn" onClick={() => navigate('/upload')}>
            📄 Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="explanation-page">
      <div className="explanation-header">
        <h1>🎓 Explain & Summarize</h1>
        <p>Generate AI-powered summaries and multi-level explanations.</p>
      </div>

      <div className="active-paper-bar">
        <span>📄</span> Active paper: <strong>{filename}</strong>
      </div>

      {/* ── Summarize Section ───────────────────────────────── */}
      <section className="explain-section">
        <h2>AI Summary</h2>
        <button
          className="explain-btn"
          onClick={handleSummarize}
          disabled={summaryLoading}
        >
          {summaryLoading ? '⏳ Generating…' : '⚡ Generate Summary'}
        </button>

        {summaryError && <div className="error-msg">{summaryError}</div>}

        {summary && (
          <div className="explanation-result">
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </section>

      {/* ── Multi-Level Explanation Section ──────────────────── */}
      <section className="explain-section">
        <h2>Multi-Level Explanation</h2>

        <div className="level-selector">
          {LEVELS.map((l) => (
            <button
              key={l}
              className={`level-btn ${level === l ? 'active' : ''}`}
              onClick={() => setLevel(l)}
            >
              {LEVEL_ICONS[l]} {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="explain-btn"
          onClick={handleExplain}
          disabled={explanationLoading}
        >
          {explanationLoading ? '⏳ Generating…' : '✨ Generate Explanation'}
        </button>

        {explanationError && <div className="error-msg">{explanationError}</div>}

        {explanation && (
          <div className="explanation-result">
            <h3>Explanation — {level.charAt(0).toUpperCase() + level.slice(1)}</h3>
            <p>{explanation}</p>
          </div>
        )}
      </section>
    </div>
  );
}
