import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  return (
    <DashboardLayout>
      <div style={{ 
        height: '60vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <ShieldAlert size={64} color="var(--error)" style={{ marginBottom: '1.5rem' }} />
        <h1>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: '2rem' }}>
          You do not have the necessary permissions to access this section.
        </p>
        <Link to="/" className="btn-primary">Back to Dashboard</Link>
      </div>
    </DashboardLayout>
  );
};
