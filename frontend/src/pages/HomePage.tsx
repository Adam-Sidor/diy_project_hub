import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import type { Project } from '../types/index';

const HomePage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const endpoint = search ? `/projects?search=${encodeURIComponent(search)}` : '/projects';
                const data = await apiFetch(endpoint);
                setProjects(data);
            } catch (err) {
                console.error('Błąd pobierania projektów:', err);
            } finally {
                setLoading(false);
            }
        };

        // Debouncing - czekamy 400ms po ostatnim znaku przed wysłaniem zapytania
        const timer = setTimeout(() => {
            fetchProjects();
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="container">
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Odkryj projekty</h2>
                
                {/* PASEK WYSZUKIWANIA */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Szukaj projektów (np. Arduino, lampka...)" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            {loading ? (
                <div className="loader-centered">Przeszukiwanie bazy...</div>
            ) : (
                <div className="project-grid">
                    {projects.map((project) => (
                        <div key={project._id} className="project-card">
                            <div className="project-img-wrapper">
                                {project.images && project.images.length > 0 ? (
                                    <img src={`http://localhost:8080${project.images[project.mainImageIndex || 0]}`} alt={project.title} />
                                ) : (
                                    <div className="no-image">Brak zdjęcia</div>
                                )}
                            </div>
                            <div className="project-body">
                                <h3>{project.title}</h3>
                                <p className="author-tag">
                                    👤 <strong>{project.author?.username || 'Nieznany'}</strong>
                                </p>
                                <p className="description">
                                    {project.description?.substring(0, 100) || 'Brak opisu'} {project.description?.length > 100 ? '...' : ''}
                                </p>
                                <div className="tags-container">
                                    {project.components?.map((comp, idx) => (
                                        <span key={idx} className="tag-item">{comp}</span>
                                    ))}
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <Link to={`/projects/${project._id}`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                                        Szczegóły
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && projects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Nie znaleźliśmy nic pasującego do Twojego wyszukiwania. Spróbuj innej frazy!</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
