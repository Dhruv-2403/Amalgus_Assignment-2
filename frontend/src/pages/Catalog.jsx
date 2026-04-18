import React, { useState, useEffect } from 'react';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

const TYPES = ['', 'Clear Float', 'Toughened', 'Laminated', 'DGU/IGU', 'Frosted', 'Reflective', 'Low-E', 'Back-Painted', 'Acoustic', 'Smart/Switchable', 'Mirror'];
const APPS = ['', 'Window', 'Shower', 'Facade', 'Railing', 'Partition', 'Kitchen', 'Office', 'Bathroom'];

export default function Catalog({ role }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [appFilter, setAppFilter] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ search, type: typeFilter, application: appFilter });
      setProducts(res.data.data);
    } catch {
      setError('Could not load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, typeFilter, appFilter]);

  const roleHints = {
    Homeowner: 'Popular for homes: Toughened for showers, Frosted for bathrooms, Back-Painted for kitchens.',
    Architect: 'Specify by application — Low-E and DGU for facades, Laminated for structural glazing.',
    Builder: 'Bulk pricing available. Filter by application and compare vendors on the product page.',
    Dealer: 'Factory-direct rates shown. Click any product for vendor contact details.',
  };

  return (
    <div className="page">
      <h1 className="page-title">Glass Product Catalog</h1>
      <p className="page-sub">{roleHints[role] || 'Browse all glass types and find the right match for your project.'}</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search glass, process, application..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 'auto' }}>
          {TYPES.map(t => <option key={t} value={t}>{t || 'All types'}</option>)}
        </select>
        <select value={appFilter} onChange={e => setAppFilter(e.target.value)} style={{ width: 'auto' }}>
          {APPS.map(a => <option key={a} value={a}>{a || 'All applications'}</option>)}
        </select>
        {(search || typeFilter || appFilter) && (
          <button className="btn btn-sm" onClick={() => { setSearch(''); setTypeFilter(''); setAppFilter(''); }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6b7280', padding: '40px 0' }}>
          <span className="spinner" /> Loading products...
        </div>
      ) : error ? (
        <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: 16, borderRadius: 8 }}>{error}</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
          No products match your filters. Try clearing them.
        </div>
      ) : (
        <div className="grid-3">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Industry note */}
      <div style={{
        marginTop: 32, padding: 16, background: '#FAEEDA', borderRadius: 10,
        borderLeft: '4px solid #EF9F27', fontSize: 13
      }}>
        <strong style={{ color: '#854F0B' }}>Industry note:</strong>
        <span style={{ color: '#633806', marginLeft: 6 }}>
          Glass is custom-manufactured — once cut, it cannot be returned or resold. Always confirm dimensions with a site measurement before ordering.
        </span>
      </div>
    </div>
  );
}
