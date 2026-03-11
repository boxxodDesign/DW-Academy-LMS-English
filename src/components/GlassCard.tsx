import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, className = '', hoverable = false }) => {
  return (
    <div 
      className={`glass-card ${className} ${hoverable ? 'hover-effect' : ''}`} 
      style={{ 
        padding: '1.5rem',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        ...style 
      }}
    >
      <style>{`
        .hover-effect:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
        }
      `}</style>
      {children}
    </div>
  );
};
