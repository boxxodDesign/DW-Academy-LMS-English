import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLMSStore } from '../store/useLMSStore';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Play, CheckCircle2, Award, ChevronRight, Lock } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { TriviaPlayer } from '../components/TriviaPlayer';

export const CoursePlayer: React.FC = () => {
  const { courseId } = useParams();
  const { courses, progress, user, updateProgress } = useLMSStore();
  const navigate = useNavigate();
  
  const course = courses.find(c => c.id === courseId);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showTrivia, setShowTrivia] = useState(false);

  if (!course) return <div>Course not found</div>;

  const activeModule = course.modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons[activeLessonIndex];

  const handleCompleteLesson = () => {
    if (!user || !activeModule || !activeLesson) return;

    const currentProgress = progress.find(p => 
      p.user_id === user.id && 
      p.course_id === course.id && 
      p.modulo_id === activeModule.id
    );

    const lecciones_vistas = currentProgress 
      ? Array.from(new Set([...currentProgress.lecciones_vistas, activeLesson.id]))
      : [activeLesson.id];

    updateProgress({
      user_id: user.id,
      course_id: course.id,
      modulo_id: activeModule.id,
      lecciones_vistas,
      score_trivia: currentProgress?.score_trivia || 0,
      tiempo_respuesta: currentProgress?.tiempo_respuesta || 0,
      completed: lecciones_vistas.length === activeModule.lessons.length && (currentProgress?.score_trivia || 0) > 0
    });

    if (activeLessonIndex < activeModule.lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
    } else if (activeModule.quiz && activeModule.quiz.length > 0) {
      setShowTrivia(true);
    }
  };

  const handleTriviaComplete = (score: number, time: number) => {
    if (!user || !activeModule) return;
    
    updateProgress({
      user_id: user.id,
      course_id: course.id,
      modulo_id: activeModule.id,
      lecciones_vistas: progress.find(p => p.modulo_id === activeModule.id)?.lecciones_vistas || [],
      score_trivia: score,
      tiempo_respuesta: time,
      completed: true
    });
    
    setShowTrivia(false);
    if (activeModuleIndex < course.modules.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
      setActiveLessonIndex(0);
    } else {
      alert('Congratulations! Course Completed.');
      navigate('/');
    }
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        {/* Course Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Dashboard</span> <ChevronRight size={10} /> 
            <span>Learning</span> <ChevronRight size={10} /> 
            <span style={{ color: 'var(--accent-primary)' }}>{course.titulo}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{course.titulo}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Module {activeModuleIndex + 1}: {activeModule?.titulo}</p>
        </div>

        <div style={{ display: 'flex', gap: '3rem' }}>
          {/* Main Content Area */}
          <div style={{ flex: 1 }}>
            {showTrivia && activeModule?.quiz ? (
              <TriviaPlayer questions={activeModule.quiz} onComplete={handleTriviaComplete} />
            ) : activeLesson ? (
                <div>
                  <GlassCard style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--bg-tertiary)', marginBottom: '2rem' }}>
                    <div style={{ padding: '3rem' }}>
                      <div style={{ 
                        background: 'rgba(225, 29, 72, 0.1)', 
                        color: 'var(--accent-primary)', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.6rem', 
                        fontWeight: 800, 
                        width: 'fit-content',
                        marginBottom: '1rem',
                        letterSpacing: '0.1em'
                      }}>
                        TECHNICAL GUIDE
                      </div>
                      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{activeLesson.titulo}</h2>

                      {activeLesson.video_url && (
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000', borderRadius: '8px', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <iframe
                            src={activeLesson.video_url}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            allowFullScreen
                          />
                        </div>
                      )}

                      {activeLesson.imagenes_array && activeLesson.imagenes_array.filter(img => img).length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                          {activeLesson.imagenes_array.filter(img => img).map((img, idx) => (
                            <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                               <img 
                                 src={img} 
                                 alt={`Technical view ${idx + 1}`} 
                                 style={{ width: '100%', height: 'auto', display: 'block' }} 
                               />
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
                        {activeLesson.contenido_texto}
                      </div>
                    </div>
                  </GlassCard>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                      <button className="btn-secondary" onClick={() => navigate('/')}>Exit Lesson</button>
                      <button className="btn-primary" onClick={handleCompleteLesson}>Complete & Next</button>
                  </div>
                </div>
            ) : (
              <GlassCard style={{ padding: '6rem', textAlign: 'center', border: '1px solid var(--bg-tertiary)' }}>
                <Lock size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
                <h3>Lesson content under maintenance.</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Please check back later or contact technical support.</p>
              </GlassCard>
            )}
          </div>

          {/* Sidebar Navigation */}
          <div style={{ width: '380px' }}>
            <GlassCard style={{ padding: '2rem', border: '1px solid var(--bg-tertiary)' }}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>■</span> Lesson Curriculum
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {course.modules.map((module, mIdx) => (
                  <div key={module.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Module {mIdx + 1}
                        </h4>
                        {progress.find(p => p.modulo_id === module.id)?.completed && <CheckCircle2 size={14} color="var(--success)" />}
                    </div>
                    <button 
                        onClick={() => { setActiveModuleIndex(mIdx); setActiveLessonIndex(0); setShowTrivia(false); }}
                        style={{ 
                            width: '100%', 
                            textAlign: 'left', 
                            background: 'transparent', 
                            color: mIdx === activeModuleIndex ? 'white' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            marginBottom: '1rem'
                        }}
                    >
                        {module.titulo}
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '1rem' }}>
                      {module.lessons.map((lesson, lIdx) => {
                        const isActive = mIdx === activeModuleIndex && lIdx === activeLessonIndex;
                        const isCompleted = progress.find(p => p.modulo_id === module.id)?.lecciones_vistas.includes(lesson.id);
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => { setActiveModuleIndex(mIdx); setActiveLessonIndex(lIdx); setShowTrivia(false); }}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.75rem', 
                              padding: '0.4rem 0', 
                              textAlign: 'left',
                              background: 'transparent',
                              color: isActive ? 'var(--accent-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                              fontSize: '0.8rem',
                              fontWeight: isActive ? 700 : 400
                            }}
                          >
                            <Play size={12} fill={isActive ? 'var(--accent-primary)' : 'transparent'} />
                            <span>{lesson.titulo}</span>
                          </button>
                        );
                      })}
                      {module.quiz && module.quiz.length > 0 && (
                        <button
                          onClick={() => { setActiveModuleIndex(mIdx); setShowTrivia(true); }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem', 
                            padding: '0.4rem 0', 
                            textAlign: 'left',
                            background: 'transparent',
                            color: mIdx === activeModuleIndex && showTrivia ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                        >
                          <Award size={12} />
                          <span>Module Certification</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
