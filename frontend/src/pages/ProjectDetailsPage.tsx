import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../types/index';

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await apiFetch(`/projects/${id}`);
                setProject(data);
            } catch (err) {
                console.error(err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten projekt?')) return;
        
        try {
            await apiFetch(`/projects/${id}`, { method: 'DELETE' });
            navigate('/');
        } catch (err) {
            alert('Błąd podczas usuwania projektu');
        }
    };

    if (loading) return <div className="loader-centered">Ładowanie szczegółów...</div>;
    if (!project) return <div className="container">Projekt nie znaleziony.</div>;

    const isAuthor = user && project.author._id === user._id;

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div className="project-details-card" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <div style={{ height: '400px', background: '#f1f5f9' }}>
                    {project.image ? (
                        <img src={`http://localhost:8080${project.image}`} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>Brak zdjęcia</div>
                    )}
                </div>
                
                <div style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', letterSpacing: '-1px' }}>{project.title}</h1>
                            <p className="author-tag">👤 Autor: <strong>{project.author?.username || 'Nieznany'}</strong></p>
                        </div>
                        {isAuthor && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to={`/edit/${project._id}`} className="btn btn-outline">Edytuj</Link>
                                <button onClick={handleDelete} className="btn" style={{ background: '#fee2e2', color: '#dc2626' }}>Usuń</button>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>O projekcie</h3>
                        <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', color: 'var(--text-muted)' }}>{project.description}</p>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Użyte komponenty</h3>
                        <div className="tags-container">
                            {project.components?.map((comp, idx) => (
                                <span key={idx} className="tag-item" style={{ fontSize: '0.9rem', padding: '6px 15px' }}>{comp}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
