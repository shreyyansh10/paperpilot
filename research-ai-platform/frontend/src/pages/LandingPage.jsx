import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const floatingCards = [
  { text: 'paper.pdf — Summary generated', delay: '0s' },
  { text: 'What is RAG? — RAG stands for...', delay: '1s' },
  { text: 'Beginner level — Simplified!', delay: '2s' },
  { text: 'Analyzing chunks — Insights ready', delay: '0.5s' },
];

const features = [
  {
    title: 'Smart PDF Upload',
    desc: 'Extract text from any research paper instantly with our intelligent parser',
  },
  {
    title: 'AI Summarization',
    desc: 'Get concise 4-6 sentence summaries of complex papers in seconds',
  },
  {
    title: '3 Learning Levels',
    desc: 'Beginner, Intermediate, Expert — tailored to your knowledge level',
  },
  {
    title: 'Chat with Paper',
    desc: 'Ask any question and get answers grounded in your actual document',
  },
];

const steps = [
  { num: '1', title: 'Upload', desc: 'Drop your research PDF into PaperPilot' },
  { num: '2', title: 'Analyze', desc: 'AI processes, chunks, and understands your paper' },
  { num: '3', title: 'Learn', desc: 'Get summaries, explanations, and chat with it' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
      }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>PaperPilot</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >{isDark ? 'Light' : 'Dark'}</button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >Login</button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'var(--accent)',
              border: 'none',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {floatingCards.map((card, i) => (
          <div key={i} style={{
            position: 'absolute',
            background: 'var(--accent-bg)',
            border: '1px solid var(--accent-border)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            animation: 'float 3s ease infinite',
            animationDelay: card.delay,
            opacity: visible ? 0.7 : 0,
            transition: 'opacity 0.8s ease',
            pointerEvents: 'none',
            ...(i === 0 ? { top: '20%', right: '8%' } :
               i === 1 ? { top: '35%', left: '6%' } :
               i === 2 ? { bottom: '30%', right: '12%' } :
                         { bottom: '20%', left: '10%' }),
          }}>
            {card.text}
          </div>
        ))}

        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '24px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <span style={{ color: 'var(--text-primary)' }}>Understand Any Research</span>
          <br />
          <span style={{ color: 'var(--accent)' }}>Paper in Minutes</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-muted)',
          maxWidth: '560px',
          lineHeight: 1.7,
          marginBottom: '36px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.15s',
        }}>
          Upload a PDF. Get AI summaries, multi-level explanations, and chat with your paper.
        </p>

        <div style={{
          display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '24px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.3s',
        }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'var(--accent)', color: '#fff',
              padding: '14px 32px', borderRadius: '8px',
              fontWeight: 600, border: 'none', cursor: 'pointer',
              fontSize: '16px', transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >Start for Free</button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', padding: '14px 32px',
              borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
              fontSize: '16px', transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >See How It Works</button>
        </div>

        <p style={{
          fontSize: '13px', color: 'var(--text-muted)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.45s',
        }}>
          Free to use &mdash; No credit card &mdash; Instant results
        </p>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700 }}>Everything You Need</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '8px' }}>
            Powered by state-of-the-art AI
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'default',
                transition: 'all 0.2s ease',
                animation: `slideUp 0.5s ease ${i * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 0 20px var(--accent-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '48px' }}>
          How It Works
        </h2>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: '24px',
          flexWrap: 'wrap', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '24px', left: '15%', right: '15%',
            height: '2px', borderBottom: '2px dashed var(--border-color)', zIndex: 0,
          }} />
          {steps.map((s, i) => (
            <div key={i} style={{
              flex: '1 1 200px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center',
              position: 'relative', zIndex: 1,
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700, marginBottom: '16px',
                boxShadow: '0 0 20px var(--accent-bg)',
              }}>{s.num}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '200px' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'var(--accent-bg)',
        borderTop: '1px solid var(--accent-border)',
        borderBottom: '1px solid var(--accent-border)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
          Ready to supercharge your research?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
          Start analyzing papers in under 60 seconds
        </p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: 'var(--accent)', color: '#fff',
            padding: '14px 40px', borderRadius: '8px',
            fontWeight: 600, border: 'none', cursor: 'pointer',
            fontSize: '16px', transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-dark)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
        >Get Started Free</button>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>PaperPilot &copy; 2024</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Built for researchers</p>
      </footer>
    </div>
  );
}
