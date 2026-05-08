import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await apiFetch('/users/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            login(data);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Błąd logowania');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-form-card">
                <h2 style={{ marginBottom: '10px' }}>Logowanie</h2>
                <p style={{ marginBottom: '25px', color: '#666' }}>Zaloguj się, aby zarządzać projektami.</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-input-group">
                        <label>Hasło</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Zaloguj się
                    </button>
                </form>
                
                <p className="auth-footer">
                    Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
