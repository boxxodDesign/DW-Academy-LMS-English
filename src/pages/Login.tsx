import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLMSStore } from '../store/useLMSStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useLMSStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem',
      background: 'var(--bg-primary)'
    }}>
      <div className="fade-in" style={{ 
        width: '100%', 
        maxWidth: '360px', 
        padding: '3rem',
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
           <div style={{ 
            width: '120px',
            margin: '0 auto 1.5rem',
           }}>
             <img src="/logo.png" alt="DW Drums Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
           </div>
           <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'white', fontWeight: 900 }}>Academy</h1>
           <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', letterSpacing: '0.05em' }}>PREMIUM SALES TRAINING</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          {error && <p style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%', height: '48px', marginBottom: '1.5rem' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Hint: `juan@lms.com` / `password123`
          </p>
        </div>
      </div>
    </div>
  );
};
