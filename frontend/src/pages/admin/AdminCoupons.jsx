import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscount: 500,
    expiryDate: '2026-12-31',
    usageLimit: 100
  });

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', newCoupon);
      setShowModal(false);
      fetchCoupons();
      alert('Coupon created successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--primary)]">Promotional Coupons</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage discounts and customer promotion codes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)]">
          <Plus size={16} /> Create New Coupon
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Code</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Discount</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Min Order</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Max Discount</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Used / Limit</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Expires</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td className="border-b border-[var(--border)] px-4 py-3"><code className="text-[15px] font-bold">{c.code}</code></td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue} Flat`}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">₹{c.minOrderAmount}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{c.maxDiscount ? `₹${c.maxDiscount}` : 'No Cap'}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{c.usedCount} / {c.usageLimit}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <button onClick={() => handleDelete(c._id)} className="rounded p-1.5 text-[var(--error)] hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-xl border border-[var(--border)] bg-white p-5 shadow-xl sm:p-7">
            <h2 className="mb-5 text-lg font-extrabold text-[var(--primary)]">Create Promo Coupon</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Coupon Code</label>
                <input type="text" required value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="e.g. FESTIVE20" className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Type</label>
                  <select value={newCoupon.discountType} onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Discount Value</label>
                  <input type="number" required value={newCoupon.discountValue} onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Min Order (₹)</label>
                  <input type="number" value={newCoupon.minOrderAmount} onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Max Discount (₹)</label>
                  <input type="number" value={newCoupon.maxDiscount} onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="mb-6 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Expiry Date</label>
                <input type="date" required value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="flex flex-wrap justify-end gap-2.5">
                <button type="button" onClick={() => setShowModal(false)} className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-[18px] py-2.5 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)]">Cancel</button>
                <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)]">Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}