import React, { useEffect, useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

const ENV_API_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
const API_BASE = ENV_API_URL ? `${ENV_API_URL}/api` : '/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin/analytics`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('queueless_admin_token')}`,
      },
    })
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!r.ok || !d?.success) {
          throw new Error(d?.error || 'Failed to load analytics');
        }
        setData(d.analytics);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load analytics:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading analytics...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Business Analytics & Insights</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            Retry Loading Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Business Analytics & Insights</h1>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Total Revenue Generated"
          value={`₹${data?.totalRevenue ? data.totalRevenue.toFixed(2) : '0.00'}`}
          icon={DollarSign}
        />
        <MetricCard
          label="Total Orders Handled"
          value={data?.totalOrders || 0}
          icon={TrendingUp}
        />
        <MetricCard
          label="Average Order Value"
          value={`₹${data?.averageOrderValue ? data.averageOrderValue.toFixed(2) : '0.00'}`}
          icon={BarChart3}
        />
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '20px 0 12px' }}>Most Popular Items</h2>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity Sold</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data?.topProducts?.map((p: any, idx: number) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ fontWeight: 700 }}>{p.quantity} units</td>
                <td style={{ fontWeight: 700, color: '#16a34a' }}>₹{p.revenue.toFixed(2)}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>
                  No sales data recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
