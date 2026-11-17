import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { RefreshCw } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--primary)]">Customer Orders Management</h1>
          <p className="text-sm text-[var(--text-secondary)]">Track and progress order fulfillment lifecycles</p>
        </div>
        <button onClick={fetchOrders} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)]">
          <RefreshCw size={14} /> Refresh Orders
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Order Number</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Customer</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Items</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Total</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Payment</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Order Lifecycle Status</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Placed At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="border-b border-[var(--border)] px-4 py-3"><strong>{o.orderNumber}</strong></td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <div>{o.user?.name || 'Customer'}</div>
                    <div className="text-xs text-[var(--text-muted)]">{o.user?.email}</div>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{o.items?.length} items</td>
                  <td className="border-b border-[var(--border)] px-4 py-3"><strong>₹{o.totalAmount?.toLocaleString('en-IN')}</strong></td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${o.paymentStatus === 'successful' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="w-auto rounded-lg border border-[var(--border)] bg-white px-2 py-1 text-[13px] text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled (Restores Stock)</option>
                    </select>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}