import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ENV_API_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
const API_BASE = ENV_API_URL ? `${ENV_API_URL}/api` : '/api';

export const SettingsPage: React.FC = () => {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin/settings`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('queueless_admin_token')}`,
      },
    })
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!r.ok || !d?.success) {
          throw new Error(d?.error || 'Failed to load shop settings');
        }
        setShop(d.settings);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load settings:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading settings...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Shop Settings & Printable QR Code</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            Retry Loading Settings
          </button>
        </div>
      </div>
    );
  }

  const qrUrl = `${window.location.protocol}//${window.location.hostname}:5173/s/${shop?.slug || 'sri-lakshmi-tea'}`;

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Shop Settings & Printable QR Code</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="table-card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Shop Profile</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Shop Name</label>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{shop?.name}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>QR Slug URL</label>
            <div style={{ fontFamily: 'monospace', color: '#d97706' }}>{qrUrl}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Phone Number</label>
            <div>{shop?.phone || 'Not configured'}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Address</label>
            <div>{shop?.address || 'Not configured'}</div>
          </div>
        </div>

        <div className="table-card" style={{ padding: 20, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Printable Shop QR Display</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 16 }}>
            Place this QR standee at your billing counter or tables for customers to scan & order.
          </p>

          <div
            style={{
              display: 'inline-block',
              padding: 24,
              border: '2px solid #0f172a',
              borderRadius: 12,
              background: '#ffffff',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{shop?.name}</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>SCAN TO ORDER & PAY</p>
            <QRCodeSVG value={qrUrl} size={180} />
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', marginTop: 12 }}>
              Powered by QueueLess
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
