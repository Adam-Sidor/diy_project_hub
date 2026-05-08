import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

const EditProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [components, setComponents] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await apiFetch(`/projects/${id}`);
                setTitle(data.title);
                setDescription(data.description);
                setComponents(data.components.join(', '));
            } catch (err) {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await apiFetch(`/projects/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    description,
                    components: components.split(',').map(c => c.trim())
                })
            });
            navigate(`/projects/${id}`);
        } catch (err: any) {
            setError(err.message || 'Błąd podczas edycji');
        }
    };

    if (loading) return <div className="loader-centered">Pobieranie danych...</div>;

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '20px 0' }}>
            <h2 style={{ marginBottom: '20px' }}>Edytuj projekt</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form-card" style={{ maxWidth: '100%' }}>
                <div className="form-input-group">
                    <label>Tytuł</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-input-group">
                    <label>Opis projektu</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        style={{ 
                            width: '100%', 
                            minHeight: '150px', 
                            borderRadius: '12px', 
                            padding: '12px', 
                            border: '1.5px solid var(--border)',
                            fontFamily: 'inherit',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div className="form-input-group">
                    <label>Komponenty (po przecinku)</label>
                    <input type="text" value={components} onChange={(e) => setComponents(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                    Zapisz zmiany
                </button>
            </form>
        </div>
    );
};

export default EditProjectPage;
