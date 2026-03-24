import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

/* ── Data ──────────────────────────────────────────────────── */
const floatingCards = [
  { text: 'paper.pdf — Summary generated', dur: '4s', delay: '0s' },
  { text: 'What is RAG? — RAG stands for...', dur: '5s', delay: '0.8s' },
  { text: 'Beginner level — Simplified!', dur: '4.5s', delay: '1.5s' },
  { text: 'Analyzing chunks — Insights ready', dur: '6s', delay: '0.3s' },
];

const features = [
  { title: 'Smart PDF Upload', desc: 'Extract text from any research paper instantly with our intelligent parser' },
  { title: 'AI Summarization', desc: 'Get concise 4-6 sentence summaries of complex papers in seconds' },
  { title: '3 Learning Levels', desc: 'Beginner, Intermediate, Expert — tailored to your knowledge level' },
  { title: 'Chat with Paper', desc: 'Ask any question and get answers grounded in your actual document' },
];

const steps = [
  { num: '1', title: 'Upload', desc: 'Drop your research PDF into PaperPilot' },
  { num: '2', title: 'Analyze', desc: 'AI processes, chunks, and understands your paper' },
  { num: '3', title: 'Learn', desc: 'Get summaries, explanations, and chat with it' },
];

const particles = [
  { top: '10%', left: '5%', size: 6, dur: '5s', delay: '0s' },
  { top: '20%', left: '15%', size: 4, dur: '7s', delay: '1s' },
  { top: '60%', left: '8%', size: 8, dur: '6s', delay: '2s' },
  { top: '80%', left: '20%', size: 5, dur: '8s', delay: '0.5s' },
  { top: '15%', right: '10%', size: 7, dur: '5.5s', delay: '1.5s' },
  { top: '40%', right: '5%', size: 4, dur: '6.5s', delay: '0.8s' },
  { top: '70%', right: '15%', size: 6, dur: '7s', delay: '2.5s' },
  { top: '30%', right: '25%', size: 5, dur: '5s', delay: '1.2s' },
  { top: '50%', left: '50%', size: 3, dur: '9s', delay: '3s' },
  { top: '5%', left: '40%', size: 6, dur: '6s', delay: '0.3s' },
  { top: '85%', left: '60%', size: 4, dur: '7.5s', delay: '1.8s' },
  { top: '45%', right: '40%', size: 5, dur: '5.5s', delay: '2.2s' },
];

/* ── Intersection Observer hook ────────────────────────────── */
function useScrollReveal() {
  const ref = useRef(null);
  const observe = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll('.animate-on-scroll').forEach((child) => child.classList.add('visible'));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { const cleanup = observe(); return cleanup; }, [observe]);
  return ref;
}

/* ── Component ─────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const featuresRef = useScrollReveal();
  const stepsRef = useScrollReveal();

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  /* ── 3D Mouse Tilt on Hero ─────────────────────────────── */
  useEffect(() => {
    const hero = heroRef.current;
    const content = heroContentRef.current;
    if (!hero || !content) return;

    const handleMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const tiltX = (x / rect.width - 0.5) * 8;
      const tiltY = (y / rect.height - 0.5) * -8;
      content.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    };

    const handleLeave = () => {
      content.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    hero.addEventListener('mousemove', handleMove);
    hero.addEventListener('mouseleave', handleLeave);
    return () => {
      hero.removeEventListener('mousemove', handleMove);
      hero.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  /* ── 3D Feature Card Handlers ──────────────────────────── */
  const handleCardEnter = (e) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateY(8deg) rotateX(4deg) translateZ(20px)';
    e.currentTarget.style.boxShadow = '-10px 10px 30px rgba(16,185,129,0.2)';
  };
  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    e.currentTarget.style.boxShadow = 'none';
  };

  /* ── Gradient background per theme ─────────────────────── */
  const heroGradient = isDark
    ? 'linear-gradient(-45deg, #000000, #0a1a0e, #000000, #051209, #0a1a0e, #000000)'
    : 'linear-gradient(-45deg, #f0fdf4, #ecfdf5, #f8fafc, #f0fdf4, #d1fae5, #ffffff)';

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
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
              background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '8px 14px', color: 'var(--text-primary)',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >{isDark ? 'Light' : 'Dark'}</button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', padding: '10px 24px', borderRadius: '8px',
              fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >Login</button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'var(--accent)', border: 'none', color: '#fff',
              padding: '10px 24px', borderRadius: '8px', fontWeight: 600,
              cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
          background: heroGradient,
          backgroundSize: '400% 400%',
          animation: 'gradientRotate 8s ease infinite',
        }}
      >
        {/* ── Particle Dots ──────────────────────────────── */}
        {particles.map((p, i) => (
          <div key={`p${i}`} style={{
            position: 'absolute',
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%',
            background: `rgba(16, 185, 129, ${0.3 + (i % 4) * 0.1})`,
            top: p.top, left: p.left, right: p.right,
            animation: `particleFloat ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }} />
        ))}

        {/* ── 3D Floating Cards ──────────────────────────── */}
        {floatingCards.map((card, i) => (
          <div key={i} style={{
            position: 'absolute',
            background: 'var(--accent-bg)',
            border: '1px solid var(--accent-border)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            animation: `float3d ${card.dur} ease-in-out infinite`,
            animationDelay: card.delay,
            opacity: visible ? 0.7 : 0,
            transition: 'opacity 0.8s ease',
            pointerEvents: 'none',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            willChange: 'transform',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            ...(i === 0 ? { top: '20%', right: '8%' } :
               i === 1 ? { top: '35%', left: '6%' } :
               i === 2 ? { bottom: '30%', right: '12%' } :
                         { bottom: '20%', left: '10%' }),
          }}>
            {card.text}
          </div>
        ))}

        {/* ── Hero Content (3D tilt target) ──────────────── */}
        <div
          ref={heroContentRef}
          style={{ transition: 'transform 0.1s ease', willChange: 'transform' }}
        >
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            animation: visible ? 'fadeInUp 0.5s ease both' : 'none',
            animationDelay: '0s',
          }}>
            <span style={{ color: 'var(--text-primary)' }}>Understand Any Research Paper</span>
            <br />
            <span style={{ color: '#10b981' }}>In Minutes</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            maxWidth: '560px',
            lineHeight: 1.7,
            marginBottom: '36px',
            margin: '0 auto 36px',
            animation: visible ? 'fadeInUp 0.5s ease both' : 'none',
            animationDelay: '0.2s',
          }}>
            Upload a PDF. Get AI summaries, multi-level explanations, and chat with your paper.
          </p>

          <div style={{
            display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center',
            marginBottom: '24px',
            animation: visible ? 'fadeInUp 0.5s ease both' : 'none',
            animationDelay: '0.4s',
          }}>
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'var(--accent)', color: '#fff',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: 600, border: 'none', cursor: 'pointer',
                fontSize: '16px', transition: 'all 0.2s ease',
                animation: 'glowPulse 2s ease-in-out infinite',
                willChange: 'box-shadow',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
            >Get Started</button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', padding: '14px 32px',
                borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                fontSize: '16px', transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >Login</button>
          </div>

          <p style={{
            fontSize: '13px', color: 'var(--text-muted)',
            animation: visible ? 'fadeInUp 0.5s ease both' : 'none',
            animationDelay: '0.6s',
          }}>
            Free to use &mdash; No credit card &mdash; Instant results
          </p>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section
        id="features"
        ref={featuresRef}
        style={{ padding: '80px 24px', maxWidth: '960px', margin: '0 auto' }}
      >
        <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '48px' }}>
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
              className={`animate-on-scroll delay-${i + 1}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'default',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section ref={stepsRef} style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="animate-on-scroll" style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '48px' }}>
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
            <div key={i} className={`animate-on-scroll delay-${i + 1}`} style={{
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
            animation: 'glowPulse 2s ease-in-out infinite',
            willChange: 'box-shadow',
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
