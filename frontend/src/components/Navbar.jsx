import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ROLES = ['Homeowner', 'Architect', 'Builder', 'Dealer'];

export default function Navbar({ role, setRole }) {
  const loc = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser(payload);
          if (payload.role) {
            setRole(payload.role);
          }
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateUser();
    window.addEventListener('authChange', updateUser);
    return () => window.removeEventListener('authChange', updateUser);
  }, [setRole]);

  const navLinks = [
    { path: '/', label: 'Catalog' },
    { path: '/ai-match', label: 'AI Match' },
    { path: '/estimate', label: 'Estimate' },
    { path: '/rates', label: 'Daily Rates' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/login';
  };

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14
            }}>A</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#111827', lineHeight: 1 }}>AmalGus</span>
              <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 400 }}>GLASS MARKETPLACE</span>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 4, flex: 1 }} className="nav-links">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: loc.pathname === l.path ? 600 : 500,
                color: loc.pathname === l.path ? '#1D9E75' : '#4b5563',
                background: loc.pathname === l.path ? '#f0fdf4' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}>{l.label}</Link>
            ))}
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f9fafb', padding: '4px 12px', borderRadius: '100px', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Role:</span>
              <select
                value={role}
                onChange={e => !user && setRole(e.target.value)}
                disabled={!!user}
                style={{
                  width: 'auto', padding: '2px 4px', fontSize: 13, fontWeight: 600,
                  background: 'transparent', border: 'none', color: '#111827', cursor: user ? 'default' : 'pointer',
                  outline: 'none'
                }}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px', fontSize: 13, background: '#fee2e2', color: '#b91c1c',
                    border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                    transition: 'background 0.2s'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link 
                  to="/login"
                  style={{
                    padding: '8px 16px', fontSize: 14, color: '#4b5563', textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Log in
                </Link>
                <Link 
                  to="/signup"
                  style={{
                    padding: '8px 20px', fontSize: 14, background: '#1D9E75', color: '#fff',
                    borderRadius: 8, textDecoration: 'none', fontWeight: 600,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
