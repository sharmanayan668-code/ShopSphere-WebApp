import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Reserved inventory will be automatically restored.')) {
      return;
    }
    try {
      setCancellingId(orderId);
      await api.post(`/orders/${orderId}/cancel`, { reason: 'Customer requested cancellation' });
      fetchOrders();
      alert('Order cancelled successfully! Stock has been restored.');
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-3.5 py-20 text-center sm:px-5">Loading your orders...</div>;

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-8 sm:px-5 sm:py-10">
      <h1 className="mb-6 text-2xl font-extrabold text-[var(--primary)] sm:text-[28px]">
        My Order History
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm sm:p-[60px]">
          <Package size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-lg font-bold text-[var(--primary)]">No Orders Placed Yet</h3>
          <p className="my-2 mb-5 text-[var(--text-secondary)]">Your ordered items and invoices will appear here.</p>
          <Link to="/products" className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)]">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
              
              {/* Order Header */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <span className="text-[13px] text-[var(--text-secondary)]">Order ID:</span>{' '}
                  <strong className="text-[15px]">{o.orderNumber}</strong>
                  <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                    Placed on: {new Date(o.createdAt).toLocaleDateString()} at {new Date(o.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                    o.orderStatus === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                    o.orderStatus === 'cancelled' ? 'border-red-200 bg-red-50 text-red-700' :
                    o.orderStatus === 'confirmed' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}>
                    Status: {o.orderStatus}
                  </span>

                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                    o.paymentStatus === 'successful' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}>
                    Pay: {o.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-5 flex flex-col gap-3">
                {o.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={item.name}
                        className="h-[45px] w-[45px] shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{item.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <strong>₹{item.subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>

              {/* Footer / Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
                <div>
                  <span className="text-[13px] text-[var(--text-secondary)]">Total Paid / Payable: </span>
                  <span className="text-lg font-extrabold text-[var(--primary)]">
                    ₹{o.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {o.paymentStatus === 'pending' && (
                    <Link to={`/payment/${o._id}`} className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[var(--secondary-hover)]">
                      Complete Payment
                    </Link>
                  )}

                  {!['shipped', 'delivered', 'cancelled'].includes(o.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(o._id)}
                      disabled={cancellingId === o._id}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--error)] hover:bg-red-50 disabled:opacity-60"
                    >
                      {cancellingId === o._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}