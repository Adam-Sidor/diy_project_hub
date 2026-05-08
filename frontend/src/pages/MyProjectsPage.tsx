import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import type { Project } from '../types/index';

const MyProjectsPage = () => {
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProjects = async () => {
            try {
                const data = await apiFetch('/projects/user/me');
                setUserProjects(data);
            } catch (err) {
                console.error('Błąd pobierania Twoich projektów:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProjects();
    }, []);

    const handleDeleteProject = async (projectId: string) => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten projekt?')) return;
        
        try {
            await apiFetch(`/projects/${projectId}`, { method: 'DELETE' });
            setUserProjects(userProjects.filter(p => p._id !== projectId));
        } catch (err) {
            alert('Błąd podczas usuwania projektu');
        }
    };

    if (loading) return <div className="loader-centered">Ładowanie Twoich projektów...</div>;

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.2rem', letterSpacing: '-1px' }}>Moje Projekty</h2>
                <Link to="/create" className="btn btn-primary">Dodaj nowy</Link>
            </div>

            <div className="project-grid">
                {userProjects.length > 0 ? (
                    userProjects.map((project) => (
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
                                <p className="description">
                                    {project.description?.substring(0, 100) || 'Brak opisu'}...
                                </p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                    <Link to={`/edit/${project._id}`} className="btn btn-outline" style={{ flex: 1 }}>
                                        Edytuj
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteProject(project._id)} 
                                        className="btn" 
                                        style={{ background: '#fee2e2', color: '#dc2626', flex: 1 }}
                                    >
                                        Usuń
                                    </button>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <Link to={`/projects/${project._id}`} style={{ fontSize: '0.85rem', color: 'var(--primary-solid)', textDecoration: 'none', fontWeight: '600' }}>
                                        Zobacz podgląd →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Nie masz jeszcze żadnych opublikowanych projektów.</p>
                        <Link to="/create" className="btn btn-primary">Zacznij tworzyć teraz</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProjectsPage;
