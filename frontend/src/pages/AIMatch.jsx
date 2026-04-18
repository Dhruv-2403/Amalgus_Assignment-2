import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiMatch } from '../api';

const QUICK_QUERIES = [
  "I need glass for my bathroom shower enclosure",
  "Soundproof glass for my office cabin",
  "Glass railing for my balcony on 15th floor",
  "Energy efficient glass for south-facing facade",
  "Decorative glass for kitchen backsplash",
  "Privacy glass for conference room partition",
];

export default function AIMatch({ role }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleMatch = async (q = query) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await aiMatch(trimmed, role);
      setResult(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'AI matching failed. Check your GEMINI_API_KEY in backend/.env');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">AI Glass Finder</h1>
      <p className="page-sub">Describe your project in plain language — our AI recommends the right glass type, thickness, and process.</p>

      {/* Input */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleMatch()}
            placeholder="e.g. I need glass for my bathroom shower enclosure..."
            style={{ fontSize: 15 }}
          />
          <button className="btn btn-primary" onClick={() => handleMatch()} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
            {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Finding...</> : 'Find glass →'}
          </button>
        </div>

        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Try these:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_QUERIES.map(q => (
            <button key={q} className="btn btn-sm" onClick={() => { setQuery(q); handleMatch(q); }}
              style={{ fontSize: 12, color: '#4b5563' }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: 14, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          {/* Primary recommendation */}
          <div className="card" style={{ padding: 20, marginBottom: 16, borderColor: '#1D9E75', borderWidth: 1.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  Top recommendation
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                  {result.primaryRecommendation.type} · {result.primaryRecommendation.thickness}
                </h2>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{result.primaryRecommendation.process}</div>
              </div>
              {result.primaryRecommendation.product && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1D9E75' }}>
                    ₹{result.primaryRecommendation.product.rateMin}–{result.primaryRecommendation.product.rateMax}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>per sqft</div>
                </div>
              )}
            </div>

            <p style={{ color: '#374151', marginBottom: 12, lineHeight: 1.6 }}>{result.primaryRecommendation.reason}</p>

            {result.primaryRecommendation.safetyNote && (
              <div style={{ background: '#FAEEDA', borderLeft: '3px solid #EF9F27', padding: '8px 12px', borderRadius: 6, fontSize: 13, color: '#633806', marginBottom: 12 }}>
                ⚠️ {result.primaryRecommendation.safetyNote}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {result.primaryRecommendation.productId && (
                <button className="btn btn-primary" onClick={() => navigate(`/product/${result.primaryRecommendation.productId}`)}>
                  View product →
                </button>
              )}
              {result.primaryRecommendation.productId && (
                <button className="btn" onClick={() => navigate(`/estimate?productId=${result.primaryRecommendation.productId}`)}>
                  Get estimate
                </button>
              )}
            </div>
          </div>

          {/* Alternatives */}
          {result.alternatives?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Alternatives to consider</div>
              <div className="grid-2">
                {result.alternatives.map((a, i) => (
                  <div key={i} className="card" style={{ padding: 14, cursor: 'pointer' }}
                    onClick={() => a.productId && navigate(`/product/${a.productId}`)}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{a.type}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{a.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Industry tip */}
          {result.industryTip && (
            <div className="card" style={{ padding: 16, background: '#E1F5EE', borderColor: '#9FE1CB' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0F6E56', marginBottom: 4 }}>💡 Industry tip</div>
              <div style={{ fontSize: 13, color: '#085041' }}>{result.industryTip}</div>
              {result.estimatedBudget && (
                <div style={{ fontSize: 12, color: '#0F6E56', marginTop: 6 }}>Estimated budget: {result.estimatedBudget}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
