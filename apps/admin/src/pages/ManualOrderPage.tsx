import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/adminClient';
import { useAuth } from '../context/AuthContext';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const ENV_API_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
const API_BASE = ENV_API_URL ? `${ENV_API_URL}/api` : '/api';

export const ManualOrderPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const loadData = () => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setProducts(data.products?.filter((p: any) => p.availability === 'AVAILABLE') || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products for POS:', err);
        setError(err.message || 'Unable to connect to the server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch(`${API_BASE}/admin/orders/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('queueless_admin_token')}`,
        },
        body: JSON.stringify({
          shopId: user?.shopId,
          items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
          paymentMethod: 'CASH',
          customerName: customerName || undefined,
          customerPhone: customerPhone || undefined,
        }),
      });

      const data = await res.json().catch(() => null);
      if (data?.success) {
        setSuccessOrder(data.order);
        setCart([]);
        setCustomerName('');
        setCustomerPhone('');
      } else {
        alert(data?.error || 'Failed to place order');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to place order');
    }
  };

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading POS...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="top-bar">
          <h1 className="page-title">Quick Counter POS Billing</h1>
        </div>
        <div className="table-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            Retry Loading POS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Quick Counter POS Billing</h1>
      </div>

      {successOrder && (
        <div
          style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: 16,
            borderRadius: 8,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>Manual Order Placed & Cash Confirmed!</strong> Token: #{successOrder.orderNumber}
          </div>
          <button className="btn btn-secondary" onClick={() => setSuccessOrder(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                background: '#ffffff',
                padding: 14,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</div>
              <div style={{ color: '#d97706', fontWeight: 800, marginTop: 4 }}>₹{p.price.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Billing Cart */}
        <div className="table-card" style={{ padding: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', gap: 8 }}>
            <ShoppingCart size={20} /> Current Bill
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Click items on left to add to bill</div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{item.price} each</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button className="btn btn-secondary" style={{ padding: '2px 6px' }} onClick={() => updateQty(item.productId, -1)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                    <button className="btn btn-secondary" style={{ padding: '2px 6px' }} onClick={() => updateQty(item.productId, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="Customer Name (Optional)"
            className="input-field"
            style={{ width: '100%', marginBottom: 8 }}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '1rem' }}
            disabled={cart.length === 0}
            onClick={handlePlaceOrder}
          >
            Collect Cash & Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};
