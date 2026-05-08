import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          🛠️ DIY Hub
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <span className="user-info">Zalogowany jako: <strong>{user.username}</strong></span>
              <button onClick={logout} className="btn btn-sm btn-outline">Wyloguj</button>
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
