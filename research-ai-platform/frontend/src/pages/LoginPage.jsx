import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0f1117',
  position: 'relative',
  overflow: 'hidden'
};

const glowStyle = {
  position: 'absolute',
  width: '420px',
  height: '420px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.25) 35%, rgba(15,17,23,0) 70%)',
  filter: 'blur(24px)'
};

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  background: '#151a24',
  border: '1px solid rgba(99, 102, 241, 0.28)',
  borderRadius: '16px',
  padding: '40px',
  position: 'relative',
  zIndex: 2,
  boxSizing: 'border-box'
};

const labelStyle = { color: '#c9d1d9', fontSize: '14px', marginBottom: '8px', display: 'block' };
const inputStyle = {
  width: '100%',
  background: '#0f1117',
  border: '1px solid #30363d',
  borderRadius: '10px',
  color: '#f0f6fc',
  padding: '12px 14px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Login failed');
        return;
      }

      login(data.user, data.token);
      navigate('/upload');
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={glowStyle} />
      <div style={cardStyle}>
        <div style={{
          fontSize: '36px',
          fontWeight: 800,
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 PaperPilot
        </div>
        <p style={{ color: '#8b949e', marginTop: 0, marginBottom: '28px' }}>Welcome back</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              color: '#fecaca',
              padding: '10px 12px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          margin: '24px 0 14px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, #30363d, transparent)'
        }} />

        <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', margin: 0 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;