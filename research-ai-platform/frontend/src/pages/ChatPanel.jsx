import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../contexts/PaperContext';
import { chatWithPaper } from '../api/client';
import './ChatPanel.css';

export default function ChatPanel() {
  const { paperId, filename } = usePaper();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithPaper(paperId, question);
      setMessages((prev) => [...prev, { role: 'assistant', text: response.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Error: ${err.response?.data?.detail || 'Failed to get response.'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // No paper uploaded — show warning
  if (!paperId) {
    return (
      <div className="chat-page">
        <div className="no-paper-card">
          <span className="no-paper-icon">⚠️</span>
          <h2>No paper uploaded yet</h2>
          <p>Please go to the Upload page first to upload a research paper.</p>
          <button className="chat-go-upload-btn" onClick={() => navigate('/upload')}>
            📄 Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>💬 Chat with Paper</h1>
        <p>Ask questions about your uploaded paper using AI-powered Q&A.</p>
      </div>

      <div className="active-paper-bar">
        <span>📄</span> Chatting about: <strong>{filename}</strong>
      </div>

      <div className="chat-window">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Ask a question about your paper to get started.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <span className="bubble-role">{msg.role === 'user' ? '🧑' : '🤖'}</span>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant typing">
            <span className="bubble-role">🤖</span>
            <p>Thinking…</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="Type your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}
