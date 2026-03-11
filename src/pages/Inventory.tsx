import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Package, Search, Filter } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Inventory: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Inventory Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track and manage hardware stock levels across regions.</p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} /> Request Stock
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
           <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by series or SKU..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'white' }}
              />
           </div>
           <button style={{ background: 'var(--bg-tertiary)', padding: '0 1.5rem', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
             <Filter size={16} /> Filters
           </button>
        </div>

        <GlassCard style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--bg-tertiary)' }}>
          <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Inventory System Under Integration</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            The real-time inventory module is currently being connected to the DW global warehouse API. Stock levels will be visible shortly.
          </p>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};
