import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useLMSStore } from '../store/useLMSStore';
import { VendedorDashboard } from './VendedorDashboard';
import { InstructorDashboard } from './InstructorDashboard';
import { AdminDashboard } from './AdminDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useLMSStore();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Instructor':
        return <InstructorDashboard />;
      case 'Salesperson':
        return <VendedorDashboard />;
      default:
        return <div>Role not recognized</div>;
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hello, {user?.nombre} 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to your training dashboard.</p>
      </div>
      {renderDashboard()}
    </DashboardLayout>
  );
};
