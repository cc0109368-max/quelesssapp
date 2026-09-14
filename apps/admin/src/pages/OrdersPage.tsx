import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, confirmCashPayment } from '../api/adminClient';
import { Printer, CheckCircle } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = () => {
    fetchOrders()
      .then((data) => {
        setOrders(data.orders || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load orders:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // Live polling fallback
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleCashConfirm = async (orderId: string) => {
    try {
      await confirmCashPayment(orderId);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm cash payment');
    }
  };

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading orders...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Orders Management</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={() => { setLoading(true); loadOrders(); }}>
            Retry Loading Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Orders Management</h1>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Token #</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: '#64748b' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                // Payment status comes from the first payment record
                const paymentStatus = order.payments?.[0]?.status ?? 'PENDING';

                return (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 900, color: '#d97706', fontSize: '1.1rem' }}>
                      {order.orderNumber}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td>{order.customerName || 'Walk-in'}</td>
                    <td>{order.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(', ')}</td>
                    <td style={{ fontWeight: 700 }}>₹{(order.total ?? 0).toFixed(2)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span className={`badge badge-${paymentStatus.toLowerCase()}`}>
                        {paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {order.paymentMethod === 'CASH' && order.status === 'CASH_PENDING' && (
                          <button
                            className="btn btn-success"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleCashConfirm(order.id)}
                          >
                            <CheckCircle size={14} /> Cash Recd
                          </button>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
