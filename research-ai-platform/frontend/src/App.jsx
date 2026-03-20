import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PaperProvider } from './contexts/PaperContext';
import LandingPage from './pages/LandingPage';
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
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/upload', label: 'Analyze' },
  { path: '/chat', label: 'Chat' },
  { path: '/citations', label: 'Citations' },
];

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="app-shell">
        <Sidebar navItems={NAV_ITEMS} onCollapsedChange={setSidebarCollapsed} />
        <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/explain" element={<ExplanationPanel />} />
            <Route path="/citations" element={<CitationExplorer />} />
            <Route path="/chat" element={<ChatPanel />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PaperProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </Router>
        </PaperProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
