import React from 'react';
import { useLMSStore } from '../store/useLMSStore';
import { GlassCard } from '../components/GlassCard';
import { Plus, BookOpen, UserPlus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const AdminDashboard: React.FC = () => {
  const { courses, users, deleteCourse } = useLMSStore();
  const navigate = useNavigate();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Administration Panel</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage platform content and users.</p>
          </div>
          <Link to="/admin/builder" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Course
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', border: '1px solid var(--bg-tertiary)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(225,29,72,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen color="var(--accent-primary)" size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>{courses.length}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Courses</p>
            </div>
          </GlassCard>

          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', border: '1px solid var(--bg-tertiary)', cursor: 'pointer' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus color="white" size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>{users.length}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Users</p>
              </div>
            </GlassCard>
          </Link>
        </div>

        {/* Courses Section */}
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--accent-primary)' }}>■</span> All Courses
        </h2>

        {courses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {courses.map(course => (
              <GlassCard key={course.id} style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--bg-tertiary)' }}>
                <div style={{ position: 'relative', height: '160px', background: `url(${course.imagen_caratula})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={(e) => { e.preventDefault(); navigate(`/admin/builder?edit=${course.id}`); }}
                      style={{ background: 'rgba(5,5,5,0.7)', padding: '8px', borderRadius: '4px', color: 'white' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(course.id, e)}
                      style={{ background: 'rgba(225,29,72,0.8)', padding: '8px', borderRadius: '4px', color: 'white' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.25rem' }}>{course.titulo}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.modules.length} Modules • {course.status}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.descripcion}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/course/${course.id}`} className="btn-secondary" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <ExternalLink size={14} /> View
                    </Link>
                    <button className="btn-secondary" style={{ flex: 1 }}>Metrics</button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--bg-tertiary)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't created any courses yet.</p>
            <Link to="/admin/builder" style={{ color: 'var(--accent-primary)', display: 'block', marginTop: '1rem', fontWeight: 700 }}>Create my first course</Link>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};
