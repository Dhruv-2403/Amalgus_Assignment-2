import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getEstimate } from '../api';

export default function Estimate({ role }) {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(searchParams.get('productId') || '');
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(2100);
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts().then(r => {
      setProducts(r.data.data);
      if (!productId && r.data.data.length > 0) setProductId(r.data.data[0]._id);
    });
  }, []);

  useEffect(() => {
    const pid = searchParams.get('productId');
    if (pid) setProductId(pid);
  }, [searchParams]);

  const handleEstimate = async () => {
    if (!productId) return;
    setLoading(true);
    setError('');
    try {
      const res = await getEstimate({ productId, widthMm: Number(width), heightMm: Number(height), quantity: Number(qty), role });
      setResult(res.data.data);
    } catch (e) {
      setError('Could not generate estimate. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const sqft = ((width / 1000) * (height / 1000) * 10.764 * qty).toFixed(2);

  return (
    <div className="page">
      <h1 className="page-title">Estimate Generator</h1>
      <p className="page-sub">Enter glass dimensions and get an instant quote with vendor comparison.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Glass type</label>
            <select value={productId} onChange={e => setProductId(e.target.value)}>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.type} {p.thickness} — ₹{p.rateMin}–{p.rateMax}/sqft</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Width (mm)</label>
              <input type="number" min="100" value={width} onChange={e => setWidth(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Height (mm)</label>
              <input type="number" min="100" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Quantity (panels)</label>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />
          </div>

          <div style={{ background: '#f9fafb', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Total area</span>
              <span style={{ fontWeight: 600 }}>{sqft} sqft</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleEstimate} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Calculating...</> : 'Generate estimate →'}
          </button>

          {error && <div style={{ color: '#A32D2D', fontSize: 13, marginTop: 10 }}>{error}</div>}
        </div>

        {/* Result */}
        {result && (
          <div>
            {/* Estimate breakdown */}
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Estimate summary</div>
              {[
                ['Glass type', `${result.product.type} ${result.product.thickness}`],
                ['Dimensions', `${result.dimensions.widthMm} × ${result.dimensions.heightMm} mm`],
                ['Quantity', `${result.dimensions.quantity} panel(s)`],
                ['Total area', `${result.dimensions.sqft} sqft`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                  <span style={{ color: '#6b7280' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 14 }}>
                {[
                  ['Glass cost', result.estimate.glassCost],
                  ['Installation', result.estimate.installationCost],
                  ['Hardware', result.estimate.hardwareCost],
                  ['GST (18%)', result.estimate.gst],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                    <span style={{ color: '#6b7280' }}>{k}</span>
                    <span>₹{v.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #e5e7eb', marginTop: 8, fontWeight: 700, fontSize: 18, color: '#1D9E75' }}>
                  <span>Total estimate</span>
                  <span>₹{result.estimate.totalEstimate.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{result.estimate.note}</div>
              </div>
            </div>

            {/* Vendor quotes */}
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Vendor quotes</div>
            <div className="grid-3" style={{ marginBottom: 16 }}>
              {result.vendorQuotes.map((v, i) => (
                <div key={v.vendorId} className="card" style={{ padding: 14, borderColor: i === 0 ? '#1D9E75' : '#e5e7eb' }}>
                  {i === 0 && <div style={{ fontSize: 10, fontWeight: 600, color: '#1D9E75', marginBottom: 4 }}>BEST PRICE</div>}
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{v.vendorName}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>{v.location}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1D9E75', marginBottom: 2 }}>₹{v.ratePerSqft}/sqft</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>⭐ {v.rating} · 🚚 {v.delivery}</div>
                  {v.verified && <div style={{ fontSize: 11, color: '#0F6E56', marginTop: 4 }}>✓ Verified vendor</div>}
                </div>
              ))}
            </div>

            {/* Allied suggestions */}
            {result.suggestedAllied.length > 0 && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>You'll also need</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {result.suggestedAllied.map(a => (
                    <div key={a._id} style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
                      <span style={{ fontWeight: 500 }}>{a.name}</span>
                      <span style={{ color: '#1D9E75', marginLeft: 8, fontWeight: 600 }}>₹{a.price.toLocaleString()}/{a.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
