import React, { useEffect, useState } from 'react';
import { fetchStaff } from '../api/adminClient';

export const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchStaff()
      .then((data) => {
        setStaff(data.staffMembers || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load staff:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading staff members...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Staff & Access Control</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            Retry Loading Staff
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Staff & Access Control</h1>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Counter</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.user?.name}</td>
                <td>{s.user?.email}</td>
                <td>
                  <span className="badge badge-ready">{s.role}</span>
                </td>
                <td>{s.counter?.name || 'All Counters / Management'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
