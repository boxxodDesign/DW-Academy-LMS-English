import React, { useState } from 'react';
import { useLMSStore } from '../store/useLMSStore';
import { GlassCard } from '../components/GlassCard';
import { UserPlus, Trash2, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { Role, User } from '../types';

export const AdminUsers: React.FC = () => {
  const { users, addUser, deleteUser } = useLMSStore();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Salesperson');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !password) return;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      nombre,
      email,
      password,
      role,
      puntos_totales: 0
    };

    addUser(newUser);
    setNombre('');
    setEmail('');
    setPassword('');
    setIsAdding(false);
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Create and manage salesperson and instructor accounts.</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isAdding ? 'Cancel' : <><UserPlus size={18} /> New User</>}
          </button>
        </div>

        {isAdding && (
          <GlassCard style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent-primary)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create New User</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ex: John Doe" 
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'white' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@dwdrums.com" 
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'white' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'white' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'white', appearance: 'none' }}
                  >
                    <option value="Salesperson">Salesperson</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', height: '42px' }}>Create User</button>
              </div>
            </form>
          </GlassCard>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {users.map(u => (
            <GlassCard key={u.id} style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: u.role === 'Admin' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {u.nombre.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{u.nombre}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{u.email}</span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ 
                      color: u.role === 'Admin' ? 'var(--accent-primary)' : (u.role === 'Instructor' ? 'var(--warning)' : 'var(--success)'),
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase'
                    }}>
                      {u.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{u.puntos_totales} pts</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Points</p>
                </div>
                {u.role !== 'Admin' && (
                  <button 
                    onClick={() => { if(window.confirm('Delete user?')) deleteUser(u.id); }}
                    style={{ background: 'transparent', color: 'var(--text-muted)' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
