import React, { useEffect, useState } from 'react';
import { fetchCounterOrders, updateCounterTicketStatus } from '../api/adminClient';
import { useAuth } from '../context/AuthContext';
import { Check, Clock } from 'lucide-react';

export const CounterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const counterId = user?.counterId || 'counter-tea';
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCounterItems = () => {
    fetchCounterOrders(counterId)
      .then((data) => {
        setItems(data.tickets || data.counterItems || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load counter items:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCounterItems();
    const interval = setInterval(loadCounterItems, 3000);
    return () => clearInterval(interval);
  }, [counterId]);

  const handleUpdateStatus = async (ticketOrItemId: string, newStatus: string) => {
    try {
      await updateCounterTicketStatus(counterId, ticketOrItemId, newStatus);
      loadCounterItems();
    } catch (err: any) {
      alert(err.message || 'Failed to update item status');
    }
  };

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading counter display...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Counter Preparation Screen (KOT)</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={() => { setLoading(true); loadCounterItems(); }}>
            Retry Loading Counter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 className="page-title">Counter Preparation Screen (KOT)</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Active items for: <strong>{user?.counterName || 'Counter'}</strong>
          </p>
        </div>
      </div>

      <div className="kot-grid">
        {items.length === 0 ? (
          <div style={{ padding: 40, color: '#64748b', textAlign: 'center', gridColumn: '1 / -1' }}>
            No pending items for this counter right now.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={`kot-card ${item.status.toLowerCase()}`}>
              <div className="kot-header">
                <span className="kot-token">#{item.order.orderNumber}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {item.quantity}x {item.productName}
                </div>
                {item.order.customerName && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                    Customer: {item.order.customerName}
                  </div>
                )}
              </div>

              <div>
                {item.status === 'PENDING' && (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: 10 }}
                    onClick={() => handleUpdateStatus(item.id, 'PREPARING')}
                  >
                    Start Preparing
                  </button>
                )}
                {item.status === 'PREPARING' && (
                  <button
                    className="btn btn-success"
                    style={{ width: '100%', justifyContent: 'center', padding: 10 }}
                    onClick={() => handleUpdateStatus(item.id, 'READY')}
                  >
                    <Check size={18} /> Mark Ready
                  </button>
                )}
                {item.status === 'READY' && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 8,
                      background: '#dcfce7',
                      color: '#16a34a',
                      fontWeight: 700,
                      borderRadius: 6,
                    }}
                  >
                    Item Ready for Customer
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
