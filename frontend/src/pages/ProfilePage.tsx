import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password && password !== confirmPassword) {
            return setError('Hasła nie są identyczne');
        }

        setLoading(true);
        try {
            const body: any = { username, email };
            if (password) body.password = password;

            const updatedData = await apiFetch('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(body)
            });

            updateUser(updatedData);
            setSuccess('Profil został zaktualizowany pomyślnie!');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Błąd podczas aktualizacji profilu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '40px 0' }}>
            <h2 style={{ marginBottom: '20px' }}>Twój profil</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div style={{ background: '#ecfdf5', color: '#059669', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600' }}>{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form-card" style={{ maxWidth: '100%' }}>
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
                    <label>Adres Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Zmień hasło (zostaw puste, aby nie zmieniać):</p>

                <div className="form-input-group">
                    <label>Nowe hasło</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="********"
                    />
                </div>

                <div className="form-input-group">
                    <label>Potwierdź nowe hasło</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="********"
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '20px' }}
                    disabled={loading}
                >
                    {loading ? 'Trwa zapisywanie...' : 'Zaktualizuj dane'}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
