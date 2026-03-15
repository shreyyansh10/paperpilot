import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ navItems }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.name || 'User';
  const userEmail = user?.email || 'No email';
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🧪</span>
        <span className="brand-name">PaperPilot</span>
      </div>
      <ul className="nav-list">
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={path === '/'}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#fff',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
          }}>
            {avatarLetter}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName}
            </div>
            <div style={{ color: '#8b949e', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: '100%',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#fca5a5',
            borderRadius: '8px',
            padding: '7px 10px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '8px'
          }}
        >
          Logout
        </button>
        <p>v0.1.0 — Local Dev</p>
      </div>
    </nav>
  );
};

export default Sidebar;