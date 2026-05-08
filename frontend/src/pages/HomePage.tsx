import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import type { Project } from '../types/index';

const HomePage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await apiFetch('/projects');
                setProjects(data);
            } catch (err) {
                console.error('Błąd pobierania projektów:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="container">
            <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Najnowsze projekty</h2>

            {loading ? (
                <div className="loader-centered">Pobieranie projektów...</div>
            ) : (
                <div className="project-grid">
                    {projects.map((project) => (
                        <div key={project._id} className="project-card">
                            <div className="project-img-wrapper">
                                {project.image ? (
                                    <img src={`http://localhost:8080${project.image}`} alt={project.title} />
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
                                    {project.description?.substring(0, 100) || 'Brak opisu'}...
                                </p>
                                <div className="tags-container">
                                    {project.components?.map((comp, idx) => (
                                        <span key={idx} className="tag-item">{comp}</span>
                                    ))}
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <button className="btn btn-outline" style={{ width: '100%' }}>Szczegóły</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && projects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Brak dostępnych projektów. Bądź pierwszym, który coś doda!</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
