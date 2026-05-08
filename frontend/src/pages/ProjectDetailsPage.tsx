import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Project, Comment } from '../types/index';

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectData, commentsData] = await Promise.all([
                    apiFetch(`/projects/${id}`),
                    apiFetch(`/projects/${id}/comments`)
                ]);
                setProject(projectData);
                setComments(commentsData);
                setActiveImage(projectData.mainImageIndex || 0);
            } catch (err) {
                console.error(err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const savedComment = await apiFetch(`/projects/${id}/comments`, {
                method: 'POST',
                body: JSON.stringify({ content: newComment })
            });
            setComments([savedComment, ...comments]);
            setNewComment('');
        } catch (err) {
            alert('Błąd podczas dodawania komentarza');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return <div className="loader-centered">Ładowanie szczegółów...</div>;
    if (!project) return <div className="container">Projekt nie znaleziony.</div>;

    const isAuthor = user && project.author._id === user._id;
    const hasImages = project.images && project.images.length > 0;

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div className="project-details-card" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow)', marginBottom: '40px' }}>
                {/* GALERIA ZDJĘĆ */}
                <div style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
                        {hasImages ? (
                            <img 
                                src={`http://localhost:8080${project.images[activeImage]}`} 
                                alt={project.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                            />
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>Brak zdjęć</div>
                        )}
                    </div>
                    
                    {hasImages && project.images.length > 1 && (
                        <div style={{ display: 'flex', gap: '10px', padding: '15px', justifyContent: 'center', background: 'white' }}>
                            {project.images.map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={`http://localhost:8080${img}`}
                                    alt={`Miniatura ${idx + 1}`}
                                    onClick={() => setActiveImage(idx)}
                                    style={{ 
                                        width: '60px', 
                                        height: '60px', 
                                        objectFit: 'cover', 
                                        borderRadius: '8px', 
                                        cursor: 'pointer',
                                        border: activeImage === idx ? '2px solid var(--primary-solid)' : '2px solid transparent',
                                        transition: '0.2s'
                                    }}
                                />
                            ))}
                        </div>
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
                        <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{project.description}</p>
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

            {/* SEKCJA KOMENTARZY */}
            <div className="comments-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>💬 Komentarze ({comments.length})</h3>

                {/* Formularz dodawania */}
                {user ? (
                    <form onSubmit={handleCommentSubmit} style={{ marginBottom: '40px' }}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Co myślisz o tym projekcie?"
                            required
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1.5px solid var(--border)',
                                marginBottom: '12px',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={submittingComment}
                        >
                            {submittingComment ? 'Wysyłanie...' : 'Dodaj komentarz'}
                        </button>
                    </form>
                ) : (
                    <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '16px', marginBottom: '40px', textAlign: 'center' }}>
                        <p>Musisz się <Link to="/login" style={{ color: 'var(--primary-solid)', fontWeight: '700' }}>zalogować</Link>, aby dodać komentarz.</p>
                    </div>
                )}

                {/* Lista komentarzy */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>👤 {comment.authorName}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(comment.createdAt).toLocaleDateString('pl-PL', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Brak komentarzy. Bądź pierwszy!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
