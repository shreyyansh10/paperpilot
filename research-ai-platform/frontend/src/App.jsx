import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PaperProvider } from './contexts/PaperContext';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ExplanationPanel from './pages/ExplanationPanel';
import CitationExplorer from './pages/CitationExplorer';
import ChatPanel from './pages/ChatPanel';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import './App.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: '📊 Dashboard' },
  { path: '/upload', label: '📄 Upload' },
  { path: '/explain', label: '🎓 Explain' },
  { path: '/citations', label: '🔗 Citations' },
  { path: '/chat', label: '💬 Chat' },
];

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/upload' : '/login'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar navItems={NAV_ITEMS} />

                    <main className="main-content">
                      <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/explain" element={<ExplanationPanel />} />
                        <Route path="/citations" element={<CitationExplorer />} />
                        <Route path="/chat" element={<ChatPanel />} />
                        <Route path="*" element={<Navigate to="/upload" replace />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PaperProvider>
    </AuthProvider>
  );
}

export default App;
