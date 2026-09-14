import React, { useEffect, useState } from 'react';
import { fetchCounters } from '../api/adminClient';

export const CountersPage: React.FC = () => {
  const [counters, setCounters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchCounters()
      .then((data) => {
        setCounters(data.counters || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load counters:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading counters...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Counter Configuration</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            Retry Loading Counters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Counter Configuration</h1>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Counter Name</th>
              <th>Assigned Items</th>
              <th>Assigned Staff</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {counters.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700 }}>{c.name}</td>
                <td>{c.products?.length || 0} Products</td>
                <td>{c.staff?.length || 0} Staff Members</td>
                <td>
                  <span className="badge badge-paid">ACTIVE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
