import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import EditProjectPage from './pages/EditProjectPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

// Komponent chroniący trasy
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loader-centered">Trwa ładowanie...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          🛠️ DIY Hub
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/create" className="btn btn-sm btn-primary">Dodaj projekt</Link>
              
              <div className="user-menu-container">
                <div className="user-trigger">
                  <span>Cześć, <strong>{user.username}</strong> ▼</span>
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">👤 Twój profil</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item" style={{ color: '#dc2626' }}>
                    🚪 Wyloguj się
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Logowanie</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Dołącz</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <p>&copy; 2026 DIY Project Hub. Wszystkie prawa zastrzeżone.</p>
    </div>
  </footer>
);

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loader-centered">Trwa ładowanie...</div>;
  }

  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Chronione trasy */}
            <Route path="/create" element={
              <ProtectedRoute><CreateProjectPage /></ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute><EditProjectPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
