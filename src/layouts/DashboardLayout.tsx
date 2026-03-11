import React, { useState } from 'react';
import { useLMSStore } from '../store/useLMSStore';
import { Search, Bell, Settings, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useLMSStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Training', path: '/', roles: ['Admin', 'Instructor', 'Salesperson'] },
    { label: 'Users', path: '/admin/users', roles: ['Admin'] },
    { label: 'Inventory', path: '/inventory', roles: ['Admin'] },
    { label: 'Technical Support', path: '/support', roles: ['Admin', 'Salesperson'] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Navigation Bar */}
      <header style={{ 
        height: '72px', 
        background: 'var(--bg-primary)', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="https://a.storyblok.com/f/165398/5126x3396/22352559c9/dw_drums_logo_white_safe.jpg" alt="DW Logo" style={{ height: '24px', width: 'auto' }} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.1em', color: 'white', textTransform: 'uppercase' }}>Academy</span>
          </Link>

          <nav style={{ display: 'flex', gap: '1.5rem' }} className="hide-mobile">
            {navItems.filter(item => item.roles.includes(user?.role || '')).map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  color: location.pathname === item.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: location.pathname === item.path ? '2px solid var(--accent-primary)' : 'none',
                  padding: '1.5rem 0'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }} className="hide-mobile">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search manuals..." 
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                color: 'white',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ background: 'transparent', color: 'var(--text-secondary)' }}><Bell size={20} /></button>
            <button style={{ background: 'transparent', color: 'var(--text-secondary)' }}><Settings size={20} /></button>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '18px', 
                background: '#444', 
                overflow: 'hidden',
                border: '2px solid var(--accent-primary)'
              }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-primary)', color: 'white', fontWeight: 700 }}>
                  {user?.nombre.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="hide-desktop" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'transparent', color: 'white' }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* User Dropdown / Mobile Menu */}
      {isMenuOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '72px', 
          right: '2rem', 
          width: '240px', 
          background: 'var(--bg-secondary)', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{user?.nombre}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{user?.role}</p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
            <button 
              onClick={handleLogout}
              style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0', color: 'var(--accent-primary)', background: 'transparent', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 4rem' }}>
        {children}
      </main>

      <footer style={{ padding: '3rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div>© 2024 Drum Workshop, Inc. Academy Portal</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="#">Safety Manual</Link>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Support Center</Link>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          main { padding: 1.5rem !important; }
        }
        @media (min-width: 769px) {
          .hide-desktop { display: none; }
        }
      `}</style>
    </div>
  );
};
