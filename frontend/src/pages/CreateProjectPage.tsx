import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUpload } from '../services/api';

const CreateProjectPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [components, setComponents] = useState(''); // Przecinek jako separator
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        
        formData.append('components', components);

        if (image) {
            formData.append('image', image);
        }

        try {
            await apiUpload('/projects', formData);
            navigate('/'); // Powrót na stronę główną po sukcesie
        } catch (err: any) {
            setError(err.message || 'Błąd podczas tworzenia projektu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '20px 0' }}>
            <h2 style={{ marginBottom: '20px' }}>Dodaj nowy projekt</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form-card" style={{ maxWidth: '100%' }}>
                <div className="form-input-group">
                    <label>Tytuł projektu</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        placeholder="np. Inteligentna lampka nocna"
                    />
                </div>

                <div className="form-input-group">
                    <label>Opis projektu</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        placeholder="Opisz jak działa Twój projekt..."
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '12px', 
                            border: '1.5px solid var(--border)', 
                            minHeight: '120px',
                            fontFamily: 'inherit',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div className="form-input-group">
                    <label>Użyte komponenty (rozdziel przecinkiem)</label>
                    <input 
                        type="text" 
                        value={components} 
                        onChange={(e) => setComponents(e.target.value)} 
                        placeholder="Arduino, LED, Rezystor 220 Ohm"
                    />
                </div>

                <div className="form-input-group">
                    <label>Zdjęcie projektu</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                        style={{ border: 'none', padding: '0' }}
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '20px' }}
                    disabled={loading}
                >
                    {loading ? 'Trwa publikowanie...' : 'Opublikuj projekt'}
                </button>
            </form>
        </div>
    );
};

export default CreateProjectPage;
