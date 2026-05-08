import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch, apiUpload } from '../services/api';

const EditProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [components, setComponents] = useState('');
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await apiFetch(`/projects/${id}`);
                setTitle(data.title);
                setDescription(data.description);
                setComponents(data.components.join(', '));
                setExistingImages(data.images || []);
                setMainImageIndex(data.mainImageIndex || 0);
            } catch (err) {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages(filesArray);

            const previewUrls = filesArray.map(file => URL.createObjectURL(file));
            setPreviews(previewUrls);
        }
    };

    const handleRemoveExistingImage = (index: number) => {
        const updated = existingImages.filter((_, i) => i !== index);
        setExistingImages(updated);
        // Jeśli usuwamy zdjęcie, które było główne, resetujemy na pierwsze dostępne
        if (mainImageIndex === index) {
            setMainImageIndex(0);
        } else if (mainImageIndex > index) {
            setMainImageIndex(mainImageIndex - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('components', components);
        formData.append('mainImageIndex', mainImageIndex.toString());
        // Wysyłamy listę zdjęć, które mają zostać
        formData.append('existingImages', JSON.stringify(existingImages));
        
        newImages.forEach(img => {
            formData.append('images', img);
        });

        try {
            await apiUpload(`/projects/${id}`, formData, 'PUT');
            navigate(`/projects/${id}`);
        } catch (err: any) {
            setError(err.message || 'Błąd podczas edycji');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loader-centered">Pobieranie danych...</div>;

    return (
        <div className="container" style={{ maxWidth: '700px', padding: '40px 0' }}>
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

                {existingImages.length > 0 && (
                    <div className="form-input-group">
                        <label>Aktualne zdjęcia (kliknij gwiazdkę, by ustawić jako główne, lub X, by usunąć):</label>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {existingImages.map((img, idx) => (
                                <div 
                                    key={idx}
                                    style={{
                                        position: 'relative',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: mainImageIndex === idx ? '3px solid var(--primary-solid)' : '1px solid var(--border)',
                                        transition: '0.2s'
                                    }}
                                >
                                    <img 
                                        src={`http://localhost:8080${img}`} 
                                        alt="Istniejące" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => setMainImageIndex(idx)}
                                    />
                                    
                                    {/* Przycisk usuwania */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(idx)}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            background: 'rgba(220, 38, 38, 0.9)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    >✕</button>

                                    {mainImageIndex === idx && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '5px',
                                            left: '5px',
                                            background: 'var(--primary-solid)',
                                            color: 'white',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            fontSize: '10px',
                                            fontWeight: '700'
                                        }}>GŁÓWNE</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-input-group">
                    <label>Dodaj nowe zdjęcia</label>
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
                        <label>Podgląd nowych zdjęć:</label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {previews.map((url, idx) => (
                                <img 
                                    key={idx} 
                                    src={url} 
                                    alt="Podgląd" 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--primary-solid)' }} 
                                />
                            ))}
                        </div>
                    </div>
                )}

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '30px' }}
                    disabled={submitting}
                >
                    {submitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
            </form>
        </div>
    );
};

export default EditProjectPage;
