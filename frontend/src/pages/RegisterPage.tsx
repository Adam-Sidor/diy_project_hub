import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Hasła nie są identyczne');
        }

        try {
            const data = await apiFetch('/users/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });
            login(data);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Błąd rejestracji');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-form-card">
                <h2 style={{ marginBottom: '10px' }}>Rejestracja</h2>
                <p style={{ marginBottom: '25px', color: '#666' }}>Dołącz do społeczności twórców DIY.</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-input-group">
                        <label>Nazwa użytkownika</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
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
                    <div className="form-input-group">
                        <label>Potwierdź hasło</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Zarejestruj się
                    </button>
                </form>
                
                <p className="auth-footer">
                    Masz już konto? <Link to="/login">Zaloguj się</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
