import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) nextErrors.name = 'Full name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) nextErrors.email = 'Invalid email format';

    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm password is required';
    else if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords must match';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setApiError(data.error || 'Registration failed');
        return;
      }

      login(data.user, data.token);
      navigate('/dashboard');
    } catch {
      setApiError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    padding: '12px 14px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle = { color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', display: 'block' };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        width: '460px',
        height: '460px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-bg) 0%, transparent 70%)',
        filter: 'blur(40px)',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '40px',
        position: 'relative',
        zIndex: 2,
        boxSizing: 'border-box'
      }}>
        <div style={{
          fontSize: '22px',
          fontWeight: 800,
          marginBottom: '8px',
          color: 'var(--accent)',
        }}>PaperPilot</div>
        <p style={{ color: 'var(--text-muted)', marginTop: 0, marginBottom: '28px' }}>Create your account</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={inputStyle}
            />
            {errors.name && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={inputStyle}
            />
            {errors.email && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>{errors.email}</div>}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
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
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>{errors.password}</div>}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                style={{ ...inputStyle, paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>{errors.confirmPassword}</div>}
          </div>

          {apiError && (
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              padding: '10px 12px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {apiError}
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
              background: 'var(--accent)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          margin: '24px 0 14px',
          height: '1px',
          background: `linear-gradient(to right, transparent, var(--border-color), transparent)`
        }} />

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;