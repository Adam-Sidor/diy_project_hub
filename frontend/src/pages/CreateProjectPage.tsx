import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUpload } from '../services/api';

const CreateProjectPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [components, setComponents] = useState(''); // Przecinek jako separator
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages(filesArray);
            setMainImageIndex(0); // Resetujemy do pierwszego przy nowym wyborze

            // Generowanie podglądów
            const previewUrls = filesArray.map(file => URL.createObjectURL(file));
            setPreviews(previewUrls);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('components', components);
        formData.append('mainImageIndex', mainImageIndex.toString());

        // Dodawanie wielu zdjęć pod kluczem 'images'
        images.forEach(image => {
            formData.append('images', image);
        });

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
        <div className="container" style={{ maxWidth: '700px', padding: '40px 0' }}>
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
                            minHeight: '150px',
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
                    <label>Zdjęcia projektu (możesz wybrać kilka)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ border: 'none', padding: '0' }}
                    />
                </div>

                {previews.length > 0 && (
                    <div className="form-input-group">
                        <label>Wybierz zdjęcie główne (okładkę):</label>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {previews.map((url, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setMainImageIndex(idx)}
                                    style={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: mainImageIndex === idx ? '3px solid var(--primary-solid)' : '3px solid transparent',
                                        transition: '0.2s'
                                    }}
                                >
                                    <img
                                        src={url}
                                        alt="Podgląd"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    {mainImageIndex === idx && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            background: 'var(--primary-solid)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '12px'
                                        }}>✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '30px' }}
                    disabled={loading}
                >
                    {loading ? 'Trwa publikowanie...' : 'Opublikuj projekt'}
                </button>
            </form>
        </div>
    );
};

export default CreateProjectPage;
