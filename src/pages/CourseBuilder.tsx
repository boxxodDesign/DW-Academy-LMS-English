import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GlassCard } from '../components/GlassCard';
import { useLMSStore } from '../store/useLMSStore';
import { Plus, Trash2, Save, Video, FileText, Image, ChevronDown, ChevronUp, AlertCircle, Edit2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Module, Lesson, QuizQuestion, Course } from '../types';

export const CourseBuilder: React.FC = () => {
  const { addCourse, updateCourse, courses } = useLMSStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const [modules, setModules] = useState<Module[]>([]);

  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [editingLesson, setEditingLesson] = useState<{ mIdx: number, lIdx: number } | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{ mIdx: number, qIdx: number } | null>(null);

  useEffect(() => {
    if (editId) {
      const course = courses.find(c => c.id === editId);
      if (course) {
        setCourseTitle(course.titulo);
        setCourseDesc(course.descripcion);
        setCourseImage(course.imagen_caratula);
        setModules(course.modules);
      }
    }
  }, [editId, courses]);

  const handleAddModule = () => {
    const newModule: Module = {
      id: 'm' + Date.now(),
      course_id: editId || '',
      orden: modules.length + 1,
      titulo: 'New Module',
      imagen_modulo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      lessons: [],
      quiz: []
    };
    setModules([...modules, newModule]);
    setExpandedModule(modules.length);
  };

  const handleAddLesson = (moduleIdx: number) => {
    const newLesson: Lesson = {
      id: 'l' + Date.now(),
      module_id: modules[moduleIdx].id,
      titulo: 'New Lesson',
      contenido_texto: 'Write your lesson content here...',
      imagenes_array: []
    };
    const newModules = [...modules];
    newModules[moduleIdx].lessons.push(newLesson);
    setModules(newModules);
    setEditingLesson({ mIdx: moduleIdx, lIdx: newModules[moduleIdx].lessons.length - 1 });
  };

  const handleAddQuiz = (moduleIdx: number) => {
    const newQuiz: QuizQuestion = {
      id: 'q' + Date.now(),
      pregunta: 'What is the correct answer?',
      opciones: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      respuesta_correcta: 0
    };
    const newModules = [...modules];
    if (!newModules[moduleIdx].quiz) newModules[moduleIdx].quiz = [];
    newModules[moduleIdx].quiz!.push(newQuiz);
    setModules(newModules);
    setEditingQuiz({ mIdx: moduleIdx, qIdx: newModules[moduleIdx].quiz!.length - 1 });
  };

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      callback(url);
    }
  };

  const handleSaveCourse = () => {
    if (!courseTitle) {
      alert('Please assign a title to the course.');
      return;
    }

    const courseData: Course = {
      id: editId || 'c' + Date.now(),
      titulo: courseTitle,
      descripcion: courseDesc,
      imagen_caratula: courseImage || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      status: 'Available',
      modules: modules
    };

    if (editId) {
      updateCourse(editId, courseData);
    } else {
      addCourse(courseData);
    }

    alert('Course saved successfully');
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{editId ? 'Edit Course' : 'Content Builder'}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Configure the structure and detailed content of your training.</p>
          </div>
          <button className="btn-primary" onClick={handleSaveCourse} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: '48px', padding: '0 2rem' }}>
            <Save size={18} /> Save Changes
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', alignItems: 'start' }}>
          {/* Main Workspace */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* General Info Card */}
            <GlassCard style={{ border: '1px solid var(--bg-tertiary)', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>■</span> General Information
              </h3>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Course Title</label>
                  <input 
                    type="text" 
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="Ex: Pedal Preventive Maintenance"
                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '1.1rem', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</label>
                  <textarea 
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    rows={4}
                    placeholder="Technical specifications and methodology..."
                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', lineHeight: 1.6 }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Modules List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Program Structure</h3>
              <button 
                onClick={handleAddModule}
                style={{ color: 'var(--accent-primary)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}
              >
                <Plus size={18} /> Add Module
              </button>
            </div>

            {modules.map((m, idx) => (
              <GlassCard key={idx} style={{ padding: 0, border: '1px solid var(--bg-tertiary)', overflow: 'hidden' }}>
                <div 
                  onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                  style={{ padding: '1.25rem 2rem', background: expandedModule === idx ? 'rgba(255,255,255,0.01)' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.8rem' }}>0{idx + 1}</span>
                    <input 
                       className="module-title-input"
                       value={m.titulo}
                       onClick={(e) => e.stopPropagation()}
                       onChange={(e) => {
                         const newModules = [...modules];
                         newModules[idx].titulo = e.target.value;
                         setModules(newModules);
                       }}
                       style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 700, fontSize: '1.1rem', width: '300px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.lessons.length} Lessons • {m.quiz?.length || 0} Trivia</span>
                    {expandedModule === idx ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </div>

                {expandedModule === idx && (
                  <div style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.2)' }}>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Lessons</p>
                            <button onClick={() => handleAddLesson(idx)} style={{ background: 'transparent', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 800 }}>+ ADD</button>
                        </div>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {m.lessons.map((lesson, lIdx) => (
                                <div key={lIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#0a0a0a', padding: '0.75rem 1.25rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.02)' }}>
                                    <FileText size={16} color="var(--text-muted)" />
                                    <span style={{ flex: 1, fontSize: '0.85rem' }}>{lesson.titulo}</span>
                                    <button 
                                      onClick={() => setEditingLesson({ mIdx: idx, lIdx })}
                                      style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                                    >
                                      Edit Content
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const newModules = [...modules];
                                        newModules[idx].lessons.splice(lIdx, 1);
                                        setModules(newModules);
                                      }}
                                      style={{ background: 'transparent', color: 'var(--error)' }}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Trivia Certification</p>
                            <button onClick={() => handleAddQuiz(idx)} style={{ background: 'transparent', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 800 }}>+ ADD QUESTION</button>
                        </div>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {m.quiz?.map((q, qIdx) => (
                                <div key={qIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#0a0a0a', padding: '0.75rem 1.25rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.02)' }}>
                                    <AlertCircle size={16} color="var(--accent-secondary)" />
                                    <span style={{ flex: 1, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.pregunta}</span>
                                    <button 
                                      onClick={() => setEditingQuiz({ mIdx: idx, qIdx })}
                                      style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                                    >
                                      Configure
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const newModules = [...modules];
                                        newModules[idx].quiz?.splice(qIdx, 1);
                                        setModules(newModules);
                                      }}
                                      style={{ background: 'transparent', color: 'var(--error)' }}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          <div style={{ position: 'sticky', top: '100px' }}>
            {editingLesson ? (
              <GlassCard style={{ border: '1px solid var(--accent-primary)', padding: '1.5rem', background: '#0D0D0D' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} /> Lesson Editor
                </h4>
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Title</label>
                    <input 
                      value={modules[editingLesson.mIdx].lessons[editingLesson.lIdx].titulo}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules[editingLesson.mIdx].lessons[editingLesson.lIdx].titulo = e.target.value;
                        setModules(newModules);
                      }}
                      style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Video URL / Local</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input 
                            placeholder="https://..."
                            value={modules[editingLesson.mIdx].lessons[editingLesson.lIdx].video_url || ''}
                            onChange={(e) => {
                                const newModules = [...modules];
                                newModules[editingLesson.mIdx].lessons[editingLesson.lIdx].video_url = e.target.value;
                                setModules(newModules);
                            }}
                            style={{ flex: 1, background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '4px' }}
                        />
                        <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0 0.75rem', borderRadius: '4px', position: 'relative' }}>
                            <Video size={16} />
                            <input 
                              type="file" 
                              accept="video/*"
                              onChange={(e) => handleFilePreview(e, (url) => {
                                const newModules = [...modules];
                                newModules[editingLesson.mIdx].lessons[editingLesson.lIdx].video_url = url;
                                setModules(newModules);
                              })}
                              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            />
                        </button>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Extra Images (URL / Local)</label>
                      <button 
                        onClick={() => {
                          const newModules = [...modules];
                          newModules[editingLesson.mIdx].lessons[editingLesson.lIdx].imagenes_array.push('');
                          setModules(newModules);
                        }}
                        style={{ background: 'transparent', color: 'var(--accent-primary)', fontSize: '0.65rem', fontWeight: 800 }}
                      >
                        + ADD IMAGE
                      </button>
                    </div>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {modules[editingLesson.mIdx].lessons[editingLesson.lIdx].imagenes_array.map((img, imgIdx) => (
                        <div key={imgIdx} style={{ display: 'flex', gap: '0.5rem' }}>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <input 
                              placeholder="Image URL..."
                              value={img}
                              onChange={(e) => {
                                const newModules = [...modules];
                                newModules[editingLesson.mIdx].lessons[editingLesson.lIdx].imagenes_array[imgIdx] = e.target.value;
                                setModules(newModules);
                              }}
                              style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '4px' }}
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const newModules = [...modules];
                              newModules[editingLesson.mIdx].lessons[editingLesson.lIdx].imagenes_array.splice(imgIdx, 1);
                              setModules(newModules);
                            }}
                            style={{ background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-primary)', padding: '0 0.75rem', borderRadius: '4px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Text Content</label>
                    <textarea 
                      value={modules[editingLesson.mIdx].lessons[editingLesson.lIdx].contenido_texto}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules[editingLesson.mIdx].lessons[editingLesson.lIdx].contenido_texto = e.target.value;
                        setModules(newModules);
                      }}
                      rows={8}
                      style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button className="btn-secondary" onClick={() => setEditingLesson(null)} style={{ width: '100%' }}>Close Editor</button>
                </div>
              </GlassCard>
            ) : editingQuiz ? (
              <GlassCard style={{ border: '1px solid var(--accent-secondary)', padding: '1.5rem', background: '#0D0D0D' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} /> Configure Question
                </h4>
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Question</label>
                    <textarea 
                      value={modules[editingQuiz.mIdx].quiz![editingQuiz.qIdx].pregunta}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules[editingQuiz.mIdx].quiz![editingQuiz.qIdx].pregunta = e.target.value;
                        setModules(newModules);
                      }}
                      rows={2}
                      style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Options</label>
                    <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {modules[editingQuiz.mIdx].quiz![editingQuiz.qIdx].opciones.map((opt, oIdx) => (
                        <div key={oIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                           <input 
                             type="radio" 
                             checked={modules[editingQuiz.mIdx].quiz![editingQuiz.qIdx].respuesta_correcta === oIdx}
                             onChange={() => {
                                const newModules = [...modules];
                                newModules[editingQuiz.mIdx].quiz![editingQuiz.qIdx].respuesta_correcta = oIdx;
                                setModules(newModules);
                             }}
                           />
                           <input 
                              value={opt}
                              onChange={(e) => {
                                const newModules = [...modules];
                                newModules[editingQuiz.mIdx].quiz![editingQuiz.qIdx].opciones[oIdx] = e.target.value;
                                setModules(newModules);
                              }}
                              style={{ flex: 1, background: '#050505', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem' }}
                           />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="btn-secondary" onClick={() => setEditingQuiz(null)} style={{ width: '100%' }}>Finish</button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard style={{ border: '1px solid var(--bg-tertiary)', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '150px', 
                    background: courseImage ? `url(${courseImage})` : 'rgba(255,255,255,0.03)', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {!courseImage && <Image size={32} color="var(--text-muted)" />}
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                        <button className="btn-secondary" style={{ padding: '8px', borderRadius: '4px', position: 'relative' }}>
                            <Edit2 size={12} />
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFilePreview(e, setCourseImage)}
                              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            />
                        </button>
                    </div>
                </div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{courseTitle || 'Course Title'}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Modules: {modules.length}</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .module-title-input:focus {
          outline: none;
          border-bottom: 2px solid var(--accent-primary) !important;
        }
        .btn-secondary {
            border: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </DashboardLayout>
  );
};
