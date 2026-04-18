import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ROLES = ['Homeowner', 'Architect', 'Builder', 'Dealer'];

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Homeowner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', { username, password, role });
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Dispatch custom event to notify App.jsx/Navbar.jsx
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '20px', marginBottom: '16px'
          }}>A</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Create Account</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Join India's leading glass marketplace</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '20px',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '15px', outline: 'none', transition: 'border-color 0.2s'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>I am a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '15px', outline: 'none', background: '#fff'
              }}
              required
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
                  fontSize: '15px', outline: 'none'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Confirm</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
                  fontSize: '15px', outline: 'none'
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px', backgroundColor: '#1D9E75', color: 'white', border: 'none',
              borderRadius: '8px', fontWeight: 600, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s', marginTop: '8px', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
