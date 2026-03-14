import { useState, useCallback } from 'react';
import { uploadPaper } from '../api/client';
import './UploadPage.css';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      setResult(response.data);
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
        <div className="result-card">
          <h2>✅ Extraction Complete</h2>
          <div className="result-meta">
            <span>Paper ID: <code>{result.paper_id}</code></span>
            <span>Characters: {result.total_characters?.toLocaleString()}</span>
            <span>Chunks: {result.total_chunks}</span>
          </div>
          <div className="result-preview">
            <h3>Text Preview</h3>
            <pre>{result.text}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
