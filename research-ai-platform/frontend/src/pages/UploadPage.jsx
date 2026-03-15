import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../contexts/PaperContext';
import { uploadPaper } from '../api/client';
import './UploadPage.css';

// ── Stopwords for top-words chart ──────────────────────────────
const STOPWORDS = new Set([
  'the','a','an','and','or','in','of','to','is','are','was','for',
  'with','this','that','it','be','as','at','by','from','on','has','have',
]);

// ── Colors ─────────────────────────────────────────────────────
const DONUT_COLORS = [
  '#6366f1','#8b5cf6','#06b6d4','#10b981',
  '#f59e0b','#ef4444','#ec4899','#14b8a6',
];
const WORD_BAR_COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'];

// ═══════════════════════════════════════════════════════════════
// Chart 1 — Word Distribution Bar Chart
// ═══════════════════════════════════════════════════════════════
function WordDistributionChart({ totalWords, totalChunks }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimate(true)); }, []);

  const avgPerChunk = Math.round(totalWords / totalChunks);
  const bars = [
    { label: 'Total Words', value: totalWords },
    { label: 'Avg per Chunk', value: avgPerChunk },
    { label: 'Chunks', value: totalChunks },
  ];
  const maxVal = Math.max(...bars.map(b => b.value));

  return (
    <div className="stat-chart-card">
      <h3 className="chart-title">Word Distribution</h3>
      <svg viewBox="0 0 320 130" className="chart-svg">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {bars.map((bar, i) => {
          const y = 10 + i * 40;
          const barWidth = maxVal > 0 ? (bar.value / maxVal) * 200 : 0;
          return (
            <g key={i}>
              <text x="0" y={y + 12} fill="var(--color-text-muted)" fontSize="11">{bar.label}</text>
              <rect
                x="105" y={y}
                width={animate ? barWidth : 0} height="20"
                rx="4" fill="url(#barGrad)"
                style={{ transition: 'width 0.8s ease' }}
              />
              <text
                x={animate ? 110 + barWidth : 110} y={y + 14}
                fill="var(--color-text)" fontSize="11" fontWeight="600"
                style={{ transition: 'x 0.8s ease' }}
              >
                {bar.value.toLocaleString()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Chart 2 — Chunk Coverage Donut Chart
// ═══════════════════════════════════════════════════════════════
function ChunkDonutChart({ totalChunks }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimate(true)); }, []);

  const displayChunks = Math.min(totalChunks, 8);
  const hasRemaining = totalChunks > 8;
  const segments = [];
  for (let i = 0; i < displayChunks; i++) segments.push(i);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const segmentSize = circumference / (hasRemaining ? displayChunks + 1 : displayChunks);
  const gap = 3;

  return (
    <div className="stat-chart-card">
      <h3 className="chart-title">Chunk Coverage</h3>
      <div className="donut-container">
        <svg viewBox="0 0 160 160" className="donut-svg">
          {segments.map((_, i) => {
            const segLen = segmentSize - gap;
            const offset = circumference - (i * segmentSize);
            return (
              <circle
                key={i} cx="80" cy="80" r={radius}
                fill="none"
                stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                strokeWidth="14"
                strokeDasharray={`${animate ? segLen : 0} ${circumference - (animate ? segLen : 0)}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            );
          })}
          {hasRemaining && (
            <circle
              cx="80" cy="80" r={radius}
              fill="none" stroke="#475569" strokeWidth="14"
              strokeDasharray={`${animate ? segmentSize - gap : 0} ${circumference - (animate ? segmentSize - gap : 0)}`}
              strokeDashoffset={circumference - (displayChunks * segmentSize)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          )}
          <text x="80" y="75" textAnchor="middle" fill="var(--color-text)" fontSize="22" fontWeight="700">
            {totalChunks}
          </text>
          <text x="80" y="95" textAnchor="middle" fill="var(--color-text-muted)" fontSize="11">
            chunks
          </text>
        </svg>
      </div>
      <div className="donut-legend">
        {segments.map((_, i) => (
          <span key={i} className="legend-item">
            <span className="legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            Chunk {i + 1}
          </span>
        ))}
        {hasRemaining && (
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#475569' }} />
            +{totalChunks - 8} more
          </span>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Chart 3 — Text Density Gauge
// ═══════════════════════════════════════════════════════════════
function TextDensityGauge({ totalWords }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimate(true)); }, []);

  const score = Math.min(100, Math.round(totalWords / 50));
  const color = score > 60 ? '#10b981' : score >= 30 ? '#f59e0b' : '#ef4444';
  const label = score > 60 ? 'Rich academic content' : score >= 30 ? 'Moderate content density' : 'Light content document';

  // Semicircle arc math
  const radius = 60;
  const semiCircumference = Math.PI * radius;
  const fillLength = (score / 100) * semiCircumference;

  // Needle angle: 180° = left, 0° = right, score maps linearly
  const needleAngle = 180 - (score / 100) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = 45;
  const cx = 90, cy = 80;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy - needleLen * Math.sin(needleRad);

  return (
    <div className="stat-chart-card">
      <h3 className="chart-title">Text Density</h3>
      <svg viewBox="0 0 180 120" className="chart-svg">
        {/* Background arc */}
        <path
          d="M 20,80 A 60,60 0 0,1 160,80"
          fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 20,80 A 60,60 0 0,1 160,80"
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${semiCircumference}`}
          strokeDashoffset={animate ? semiCircumference - fillLength : semiCircumference}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={animate ? nx : cx - needleLen} y2={animate ? ny : cy}
          stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round"
          style={{ transition: 'x2 1s ease, y2 1s ease' }}
        />
        <circle cx={cx} cy={cy} r="4" fill="var(--color-text)" />
        {/* Score text */}
        <text x={cx} y={cy + 20} textAnchor="middle" fill={color} fontSize="18" fontWeight="700">
          {score}%
        </text>
        {/* Labels */}
        <text x="15" y="100" fill="var(--color-text-muted)" fontSize="9">Sparse</text>
        <text x="145" y="100" fill="var(--color-text-muted)" fontSize="9">Dense</text>
      </svg>
      <p className="gauge-label" style={{ color }}>{label}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Chart 4 — Top Words in Preview
// ═══════════════════════════════════════════════════════════════
function TopWordsChart({ preview }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimate(true)); }, []);

  const words = (preview || '')
    .split(/\s+/)
    .map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(w => w.length > 1 && !STOPWORDS.has(w));

  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxFreq = sorted.length > 0 ? sorted[0][1] : 1;
  const barMaxH = 90;
  const barW = 36;
  const spacing = 52;
  const svgWidth = Math.max(280, sorted.length * spacing + 20);

  return (
    <div className="stat-chart-card">
      <h3 className="chart-title">Top Words in Preview</h3>
      {sorted.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          Not enough data in preview
        </p>
      ) : (
        <svg viewBox={`0 0 ${svgWidth} 150`} className="chart-svg">
          <defs>
            {sorted.map((_, i) => (
              <linearGradient key={i} id={`wordGrad${i}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={WORD_BAR_COLORS[i % WORD_BAR_COLORS.length]} stopOpacity="0.6" />
                <stop offset="100%" stopColor={WORD_BAR_COLORS[i % WORD_BAR_COLORS.length]} />
              </linearGradient>
            ))}
          </defs>
          {sorted.map(([word, count], i) => {
            const barH = (count / maxFreq) * barMaxH;
            const x = 20 + i * spacing;
            const y = 100 - barH;
            return (
              <g key={i}>
                {/* Frequency label */}
                <text
                  x={x + barW / 2} y={animate ? y - 5 : 100}
                  textAnchor="middle" fill="var(--color-text)" fontSize="11" fontWeight="600"
                  style={{ transition: 'y 0.8s ease' }}
                >
                  {count}
                </text>
                {/* Bar */}
                <rect
                  x={x} y={animate ? y : 100}
                  width={barW} height={animate ? barH : 0}
                  rx="4" fill={`url(#wordGrad${i})`}
                  style={{ transition: 'y 0.8s ease, height 0.8s ease' }}
                />
                {/* Word label */}
                <text
                  x={x + barW / 2} y="120"
                  textAnchor="middle" fill="var(--color-text-muted)" fontSize="9"
                  transform={`rotate(30, ${x + barW / 2}, 120)`}
                >
                  {word.length > 8 ? word.slice(0, 7) + '…' : word}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Upload Page
// ═══════════════════════════════════════════════════════════════
export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { setPaper } = usePaper();
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const response = await uploadPaper(file);
      const data = response.data;
      setResult(data);

      // Save to global context
      setPaper({
        paperId: data.paper_id,
        filename: data.filename,
        totalWords: data.total_words,
        totalChunks: data.total_chunks,
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Is the Paper Service running?');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>📄 Upload Research Paper</h1>
        <p>Drop a PDF to extract text, generate summaries, and explore citations.</p>
      </div>

      <div
        className={`drop-zone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          hidden
        />
        {file ? (
          <div className="file-info">
            <span className="file-icon">📎</span>
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        ) : (
          <div className="drop-prompt">
            <span className="drop-icon">☁️</span>
            <p>Drag & drop your PDF here, or click to browse</p>
          </div>
        )}
      </div>

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? '⏳ Processing…' : '🚀 Upload & Extract'}
      </button>

      {error && <div className="error-msg">{error}</div>}

      {result && (
        <>
          <div className="result-card">
            <h2>✅ Extraction Complete</h2>
            <div className="result-meta">
              <span>Paper ID: <code>{result.paper_id}</code></span>
              <span>Total Words: {result.total_words?.toLocaleString()}</span>
              <span>Total Chunks: {result.total_chunks}</span>
            </div>
            <div className="result-preview">
              <h3>Text Preview</h3>
              <pre>{result.preview}</pre>
            </div>

            <button
              className="upload-btn go-explain-btn"
              onClick={() => navigate('/explain')}
            >
              ✨ Go to Explain →
            </button>
          </div>

          {/* ── Paper Statistics Charts ──────────────────────── */}
          <div className="stats-section">
            <h2 className="stats-heading">📊 Paper Statistics</h2>
            <div className="stats-grid">
              <WordDistributionChart
                totalWords={result.total_words}
                totalChunks={result.total_chunks}
              />
              <ChunkDonutChart totalChunks={result.total_chunks} />
              <TextDensityGauge totalWords={result.total_words} />
              <TopWordsChart preview={result.preview} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
