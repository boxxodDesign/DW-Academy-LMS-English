import React, { useState } from 'react';
import { useLMSStore } from '../store/useLMSStore';
import { GlassCard } from '../components/GlassCard';
import { Play, CheckCircle2, ChevronRight, BookOpen, Clock, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VendedorDashboard: React.FC = () => {
  const { courses, progress, user } = useLMSStore();
  const [activeTab, setActiveTab] = useState<'learning' | 'catalog'>('learning');

  const getCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || course.modules.length === 0) return 0;
    const courseProgress = progress.filter(p => p.course_id === courseId && p.user_id === user?.id);
    const completedModules = courseProgress.filter(p => p.completed).length;
    return Math.round((completedModules / course.modules.length) * 100);
  };

  const myCourses = courses.filter(c => 
    progress.some(p => p.course_id === c.id && p.user_id === user?.id)
  );

  const lastActiveCourse = myCourses.length > 0 ? myCourses[0] : courses[0];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      {lastActiveCourse && (
        <div style={{ 
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '3rem',
          background: `linear-gradient(rgba(5, 5, 5, 0.4), rgba(5, 5, 5, 0.95)), url(${lastActiveCourse.imagen_caratula})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '450px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem',
          border: '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.5s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em' }}>
              DW ACADEMY PRO
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>
              <Star size={14} fill="var(--accent-secondary)" /> HARDWARE ELITE
            </div>
          </div>
          
          <h1 style={{ fontSize: '4rem', lineHeight: '1', marginBottom: '1.5rem', maxWidth: '800px', fontWeight: 900 }}>
            {lastActiveCourse.titulo} <br />
            <span style={{ color: 'var(--text-secondary)', fontSize: '2.5rem' }}>Master Technical Series</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Master every component of the {lastActiveCourse.titulo} series. From engineering specifications to preventive maintenance protocols for the professional market.
          </p>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to={`/course/${lastActiveCourse.id}`} className="btn-primary" style={{ height: '56px', padding: '0 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
              <Play size={20} fill="white" /> CONTINUE LEARNING
            </Link>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.2rem' }}>{getCourseProgress(lastActiveCourse.id)}%</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>Progress</p>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.2rem' }}>{user?.puntos_totales}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>Total Points</p>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('learning')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: activeTab === 'learning' ? 'white' : 'var(--text-muted)', 
            fontSize: '1rem', 
            fontWeight: 800, 
            padding: '0.75rem 0', 
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
        >
          MY LEARNING
          {activeTab === 'learning' && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '3px', background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0' }} />}
        </button>
        <button 
          onClick={() => setActiveTab('catalog')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: activeTab === 'catalog' ? 'white' : 'var(--text-muted)', 
            fontSize: '1rem', 
            fontWeight: 800, 
            padding: '0.75rem 0', 
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
        >
          COURSE CATALOG
          {activeTab === 'catalog' && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '3px', background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0' }} />}
        </button>
      </div>

      {activeTab === 'learning' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {myCourses.length > 0 ? myCourses.map(course => (
            <CourseCard key={course.id} course={course} progress={getCourseProgress(course.id)} />
          )) : (
            <div style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center' }}>
                <GlassCard style={{ display: 'inline-block', padding: '3rem 5rem' }}>
                    <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ marginBottom: '1rem' }}>No active courses</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Explore the catalog to start your technical training.</p>
                    <button className="btn-primary" onClick={() => setActiveTab('catalog')}>Go to Catalog</button>
                </GlassCard>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} progress={getCourseProgress(course.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCard: React.FC<{ course: any, progress: number }> = ({ course, progress }) => (
  <GlassCard className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ position: 'relative', height: '180px', background: `url(${course.imagen_caratula})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {progress > 0 && (
            <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                {progress === 100 ? (
                    <div className="status-badge status-viewed"><CheckCircle2 size={12} /> CERTIFIED</div>
                ) : (
                    <div className="status-badge status-in-progress" style={{ background: 'rgba(225,29,72,0.9)' }}>● {progress}% COMPLETE</div>
                )}
            </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ height: '100%', background: 'var(--accent-primary)', width: `${progress}%`, transition: 'width 1s ease-out' }} />
        </div>
    </div>
    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: 'var(--accent-primary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
            {course.modules.length} MODULES • HARDWARE TRAINING
        </p>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'white' }}>{course.titulo}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>
            {course.descripcion}
        </p>
        <Link 
            to={`/course/${course.id}`} 
            className={progress > 0 ? "btn-primary" : "btn-secondary"} 
            style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
            {progress === 100 ? 'REVIEW COURSE' : progress > 0 ? 'CONTINUE' : 'START COURSE'} <ChevronRight size={18} />
        </Link>
    </div>
  </GlassCard>
);
