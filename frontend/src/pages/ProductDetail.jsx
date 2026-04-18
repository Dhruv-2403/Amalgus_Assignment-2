import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api';

export default function ProductDetail({ role }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductById(id)
      .then(r => setData(r.data.data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page" style={{ color: '#6b7280', display: 'flex', gap: 10, alignItems: 'center' }}><span className="spinner" /> Loading...</div>;
  if (error) return <div className="page"><div style={{ color: '#A32D2D' }}>{error}</div></div>;

  const { product, vendors, allied } = data;
  const midRate = Math.round((product.rateMin + product.rateMax) / 2);

  return (
    <div className="page">
      <button className="btn btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Product info */}
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              {product.type}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{product.thickness} · {product.process}</h1>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>{product.description}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {product.applications.map(a => <span key={a} className="badge badge-green">{a}</span>)}
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#1D9E75' }}>₹{product.rateMin}–{product.rateMax}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>per sqft (today's rate)</div>
              </div>
            </div>
          </div>

          {/* Safety note if high */}
          {product.safetyRating === 'very_high' && (
            <div style={{ background: '#FAEEDA', borderLeft: '4px solid #EF9F27', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              <strong style={{ color: '#854F0B' }}>Safety requirement:</strong>
              <span style={{ color: '#633806', marginLeft: 4 }}>This glass type is mandatory for high-risk applications. Ensure BIS certification and professional installation.</span>
            </div>
          )}

          {/* Allied products */}
          {allied.length > 0 && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>You'll also need</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {allied.map(a => (
                  <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>{a.category}</div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#1D9E75' }}>₹{a.price.toLocaleString()}/{a.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Vendor comparison */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Compare vendors</div>
          {vendors.length === 0 ? (
            <div className="card" style={{ padding: 16, color: '#6b7280' }}>No vendors listed for this product yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {vendors.map((v, i) => (
                <div key={v._id} className="card" style={{ padding: 16, borderColor: i === 0 ? '#1D9E75' : '#e5e7eb' }}>
                  {i === 0 && <div style={{ fontSize: 11, color: '#1D9E75', fontWeight: 600, marginBottom: 6 }}>BEST PRICE</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>{v.location}</div>
                    </div>
                    {v.verified && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Verified</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1D9E75' }}>₹{v.quotedRate}/sqft</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                      <div>⭐ {v.rating} ({v.reviews} reviews)</div>
                      <div>🚚 {v.delivery}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-primary" onClick={() => navigate(`/estimate?productId=${product._id}`)}>
                      Get estimate
                    </button>
                    <a href={`tel:${v.contact}`} className="btn btn-sm">📞 Call</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
