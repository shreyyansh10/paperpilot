import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DashboardPage.css';

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target <= 0) { setCount(0); return; }
    let start = 0;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);

  return count;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const userName = user?.name || 'Researcher';

  const [stats, setStats] = useState({ papers: 0, summaries: 0, explanations: 0, chats: 0 });
  const [recentPapers, setRecentPapers] = useState([]);

  useEffect(() => {
    setStats({
      papers: parseInt(localStorage.getItem(`paperpilot_papers_count_${userId}`) || '0'),
      summaries: parseInt(localStorage.getItem(`paperpilot_summaries_count_${userId}`) || '0'),
      explanations: parseInt(localStorage.getItem(`paperpilot_explanations_count_${userId}`) || '0'),
      chats: parseInt(localStorage.getItem(`paperpilot_chats_count_${userId}`) || '0'),
    });
    const recent = JSON.parse(localStorage.getItem(`paperpilot_recent_papers_${userId}`) || '[]');
    setRecentPapers(recent);
  }, [userId]);

  const papersCount = useCountUp(stats.papers);
  const summariesCount = useCountUp(stats.summaries);
  const explanationsCount = useCountUp(stats.explanations);
  const chatsCount = useCountUp(stats.chats);

  const statCards = [
    { label: 'Papers Uploaded', count: papersCount },
    { label: 'Summaries Generated', count: summariesCount },
    { label: 'Explanations Created', count: explanationsCount },
    { label: 'Chat Messages', count: chatsCount },
  ];

  return (
    <div className="dash-page">
      {/* Welcome */}
      <div className="dash-welcome">
        <h1>{getGreeting()}, {userName}</h1>
        <p>Here's your research activity</p>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="dash-stat-card"
            style={{ animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}
          >
            <div className="dash-stat-number">{s.count}</div>
            <div className="dash-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Papers */}
      <div className="dash-section">
        <h2>Recent Papers</h2>
        <p className="dash-section-sub">Continue working on your papers</p>
        {recentPapers.length === 0 ? (
          <div className="dash-empty">
            <p>No papers yet</p>
            <button className="dash-accent-btn" onClick={() => navigate('/upload')}>
              Upload Your First Paper
            </button>
          </div>
        ) : (
          <div className="dash-papers-grid">
            {recentPapers.slice(0, 3).map((paper, i) => (
              <div
                key={i}
                className="dash-paper-card"
                style={{ animation: `slideInLeft 0.4s ease ${i * 0.1}s both` }}
              >
                <div className="dash-paper-info">
                  <div className="dash-paper-top">
                    <span>{paper.filename}</span>
                    <span className="dash-paper-date">
                      {new Date(paper.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="dash-paper-stats">
                    Words: {paper.total_words?.toLocaleString()}&ensp;|&ensp;Chunks: {paper.total_chunks}
                  </div>
                </div>
                <button className="dash-accent-btn" onClick={() => navigate('/upload')}>
                  Analyze Again
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
