import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const midRate = Math.round((product.rateMin + product.rateMax) / 2);

  const safetyColor = {
    very_high: { bg: '#FCEBEB', color: '#A32D2D', label: 'High Safety' },
    high: { bg: '#E1F5EE', color: '#0F6E56', label: 'Safety Grade' },
    standard: { bg: '#f3f4f6', color: '#4b5563', label: 'Standard' },
  }[product.safetyRating] || {};

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ padding: 16, cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#1D9E75';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,158,117,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {product.type}
        </span>
        <span className="badge" style={{ background: safetyColor.bg, color: safetyColor.color, fontSize: 10 }}>
          {safetyColor.label}
        </span>
      </div>

      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{product.thickness} · {product.process}</div>
      <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 10, lineHeight: 1.4 }}>{product.description}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {product.applications.slice(0, 3).map(a => (
          <span key={a} className="badge badge-green" style={{ fontSize: 11 }}>{a}</span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1D9E75' }}>₹{product.rateMin}–{product.rateMax}</div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>per sqft</div>
        </div>
        <button className="btn btn-sm btn-primary" onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
          View →
        </button>
      </div>
    </div>
  );
}
