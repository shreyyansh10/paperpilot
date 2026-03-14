import { useState } from 'react';
import { explainPaper } from '../api/client';
import './ExplanationPanel.css';

const LEVELS = ['beginner', 'intermediate', 'expert'];

export default function ExplanationPanel() {
  const [level, setLevel] = useState('beginner');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  const handleExplain = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await explainPaper('demo-paper', text, level);
      setExplanation(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate explanation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explanation-page">
      <div className="explanation-header">
        <h1>🎓 Multi-Level Explanation</h1>
        <p>Paste paper text and choose a complexity level for the AI explanation.</p>
      </div>

      <div className="level-selector">
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`level-btn ${level === l ? 'active' : ''}`}
            onClick={() => setLevel(l)}
          >
            {l === 'beginner' && '🟢'} {l === 'intermediate' && '🟡'} {l === 'expert' && '🔴'} {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      <textarea
        className="text-input"
        placeholder="Paste your paper text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />

      <button className="explain-btn" onClick={handleExplain} disabled={loading || !text.trim()}>
        {loading ? '⏳ Generating…' : '✨ Generate Explanation'}
      </button>

      {error && <div className="error-msg">{error}</div>}

      {explanation && (
        <div className="explanation-result">
          <h2>Explanation — {explanation.level?.charAt(0).toUpperCase() + explanation.level?.slice(1)}</h2>
          <p>{explanation.explanation}</p>
        </div>
      )}
    </div>
  );
}
