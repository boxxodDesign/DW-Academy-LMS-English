import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LifeBuoy, FileText, MessageSquare, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Support: React.FC = () => {
  const categories = [
    { title: 'Technical Manuals', icon: <FileText />, desc: 'Assembly and adjustment guides for all hardware series.' },
    { title: 'Maintenance Videos', icon: <LifeBuoy />, desc: 'Step-by-step videos for pedal and stand maintenance.' },
    { title: 'Contact Support', icon: <MessageSquare />, desc: 'Direct line to our technical engineering team.' },
  ];

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Technical Support</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Resource center for hardware specifications and troubleshooting.</p>
        </div>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', display: 'grid', gap: '2rem' }}>
          {categories.map((cat, idx) => (
            <GlassCard key={idx} style={{ padding: '2rem', border: '1px solid var(--bg-tertiary)' }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                {React.cloneElement(cat.icon as React.ReactElement, { size: 32 })}
              </div>
              <h3 style={{ marginBottom: '1rem' }}>{cat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {cat.desc}
              </p>
              <button style={{ background: 'transparent', color: 'white', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--accent-primary)', paddingBottom: '0.25rem' }}>
                Access Resources <ExternalLink size={14} />
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
