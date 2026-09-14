import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../api/adminClient';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchAuditLogs()
      .then((data) => {
        setLogs(data.logs || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load audit logs:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading audit trail...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Immutable Action Audit Logs</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            Retry Loading Logs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Immutable Action Audit Logs</h1>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Entity ID</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: '#d97706' }}>{log.action}</td>
                  <td>{log.entity}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.entityId}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.userId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
