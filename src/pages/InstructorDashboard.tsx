import React, { useState } from 'react';
import { useLMSStore } from '../store/useLMSStore';
import { GlassCard } from '../components/GlassCard';
import { Search, User as UserIcon, ExternalLink } from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { users, progress } = useLMSStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.role === 'Salesperson' && 
    (u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getUserMetrics = (userId: string) => {
    const userProgress = progress.filter(p => p.user_id === userId);
    const completedCourses = userProgress.filter(p => p.completed).length;
    const avgScore = userProgress.length > 0 
      ? Math.round(userProgress.reduce((acc, curr) => acc + curr.score_trivia, 0) / userProgress.length)
      : 0;
    
    return { completedCourses, avgScore };
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              color: 'white' 
            }}
          />
        </div>
      </div>

      <GlassCard style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--bg-tertiary)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bg-tertiary)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>User</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Email</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Comp. Courses</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Average</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Points</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const { completedCourses, avgScore } = getUserMetrics(user.id);
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <UserIcon size={16} />
                        </div>
                        <span style={{ fontWeight: 600, color: 'white' }}>{user.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</td>
                    <td style={{ padding: '1.25rem', color: 'white', fontWeight: 600 }}>{completedCourses}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.65rem', 
                        fontWeight: 800,
                        background: avgScore > 70 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(225, 29, 72, 0.1)',
                        color: avgScore > 70 ? 'var(--success)' : 'var(--accent-primary)',
                        border: `1px solid ${avgScore > 70 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(225, 29, 72, 0.2)'}`
                      }}>
                        {avgScore}%
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem', fontWeight: 700, color: 'white' }}>{user.puntos_totales}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <button style={{ background: 'transparent', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        Details <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
