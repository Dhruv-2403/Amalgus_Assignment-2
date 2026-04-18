import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AIMatch from './pages/AIMatch';
import Estimate from './pages/Estimate';
import Rates from './pages/Rates';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  const [role, setRole] = useState('Homeowner');

  useEffect(() => {
    const updateRoleFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role) {
            setRole(payload.role);
          }
        } catch (e) {
          console.error('Failed to decode token', e);
        }
      }
    };

    updateRoleFromToken();
    window.addEventListener('authChange', updateRoleFromToken);
    return () => window.removeEventListener('authChange', updateRoleFromToken);
  }, []);

  return (
    <div>
      <Navbar role={role} setRole={setRole} />
      <Routes>
        <Route path="/" element={<Catalog role={role} />} />
        <Route path="/product/:id" element={<ProductDetail role={role} />} />
        <Route path="/ai-match" element={<AIMatch role={role} />} />
        <Route path="/estimate" element={<Estimate role={role} />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}
