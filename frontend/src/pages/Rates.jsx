import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRates } from '../api';

const COLORS = ['#1D9E75', '#378ADD', '#EF9F27', '#E24B4A'];

export default function Rates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRates()
      .then(r => setData(r.data.data))
      .catch(() => setError('Could not load rates. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page" style={{ color: '#6b7280', display: 'flex', gap: 10, alignItems: 'center' }}><span className="spinner" /> Loading rates...</div>;
  if (error) return <div className="page"><div style={{ color: '#A32D2D' }}>{error}</div></div>;

  // Build trend chart data
  const trendSeries = Object.entries(data.trend);
  const chartData = data.trendLabels.map((label, i) => {
    const point = { label };
    trendSeries.forEach(([name, vals]) => { point[name] = vals[i]; });
    return point;
  });

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <h1 className="page-title">Daily Glass Rates</h1>
        <div style={{ fontSize: 12, color: '#9ca3af', background: '#f3f4f6', padding: '4px 10px', borderRadius: 20 }}>
          Updated: {data.date}
        </div>
      </div>
      <p className="page-sub">Live factory rates for all glass types. Prices in ₹ per sqft.</p>

      {/* Rate ticker grid */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {data.rates.map(r => (
          <div key={r.productId} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, lineHeight: 1.3 }}>{r.type}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1D9E75' }}>₹{r.rate}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>per sqft</div>
            <div style={{
              fontSize: 12, fontWeight: 500,
              color: r.change > 0 ? '#0F6E56' : r.change < 0 ? '#A32D2D' : '#9ca3af'
            }}>
              {r.change > 0 ? '▲' : r.change < 0 ? '▼' : '–'} {r.change !== 0 ? `₹${Math.abs(r.change)} (${Math.abs(r.changePercent).toFixed(1)}%)` : 'No change'}
            </div>
          </div>
        ))}
      </div>

      {/* 7-day trend chart */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>7-day price trend</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `₹${v}`} width={55} />
            <Tooltip formatter={(v, name) => [`₹${v}/sqft`, name]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {trendSeries.map(([name], i) => (
              <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ fontSize: 12, color: '#9ca3af' }}>
        * Rates are indicative and vary by brand, thickness, region, and order volume. Contact vendors for final pricing.
      </div>
    </div>
  );
}
