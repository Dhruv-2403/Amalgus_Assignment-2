import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Dispatch custom event to notify App.jsx/Navbar.jsx
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
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
        maxWidth: '400px',
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
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Welcome Back</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Log in to your AmalGus account</p>
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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Password</label>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px', backgroundColor: '#1D9E75', color: 'white', border: 'none',
              borderRadius: '8px', fontWeight: 600, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s', marginTop: '8px', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
