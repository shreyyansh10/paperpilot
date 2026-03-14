import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ExplanationPanel from './pages/ExplanationPanel';
import CitationExplorer from './pages/CitationExplorer';
import ChatPanel from './pages/ChatPanel';
import './App.css';

const NAV_ITEMS = [
  { path: '/', label: '📊 Dashboard' },
  { path: '/upload', label: '📄 Upload' },
  { path: '/explain', label: '🎓 Explain' },
  { path: '/citations', label: '🔗 Citations' },
  { path: '/chat', label: '💬 Chat' },
];

function App() {
  return (
    <Router>
      <div className="app-layout">
        <nav className="sidebar">
          <div className="sidebar-brand">
            <span className="brand-icon">🧪</span>
            <span className="brand-name">PaperPilot</span>
          </div>
          <ul className="nav-list">
            {NAV_ITEMS.map(({ path, label }) => (
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
            <p>v0.1.0 — Local Dev</p>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/explain" element={<ExplanationPanel />} />
            <Route path="/citations" element={<CitationExplorer />} />
            <Route path="/chat" element={<ChatPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
