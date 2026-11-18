import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AlertTriangle, RefreshCw, History } from 'lucide-react';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [changeQty, setChangeQty] = useState(5);
  const [reason, setReason] = useState('Stock replenishing from distributor');
  const [adjusting, setAdjusting] = useState(false);

  const fetchInventory = async () => {
    try {
      const [invRes, movRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/inventory/movements?limit=15')
      ]);
      setItems(invRes.data || []);
      setMovements(movRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('A valid reason is required for audit logs');
      return;
    }
    setAdjusting(true);
    try {
      await api.post(`/inventory/${selectedProduct._id}/adjust`, {
        changeQuantity: Number(changeQty),
        reason
      });
      setSelectedProduct(null);
      fetchInventory();
      alert('Stock successfully adjusted and logged into InventoryMovement!');
    } catch (err) {
      alert(err.message);
    } finally {
      setAdjusting(false);
    }
  };

  const displayedItems = filterLowStock ? items.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock') : items;

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--primary)]">Inventory & Audit Trail</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage stock levels with mandatory enterprise audit logs</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
              filterLowStock ? 'bg-[var(--error)] text-white hover:bg-red-700' : 'border border-[var(--border)] bg-white text-[var(--text-main)] hover:bg-[var(--surface-alt)]'
            }`}
          >
            <AlertTriangle size={14} /> {filterLowStock ? 'Showing Low Stock Only' : 'Filter Low Stock'}
          </button>
          <button onClick={fetchInventory} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)]">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mb-10 min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <h3 className="mb-4 text-base font-bold text-[var(--primary)]">Current Product Stock Overview</h3>
        <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Product</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">SKU</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Category</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Current Stock</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Threshold</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Status</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.map((item) => (
                <tr key={item._id}>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'} alt="" className="h-9 w-9 rounded object-cover" />
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3"><code>{item.sku}</code></td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{item.category}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3"><strong className="text-base">{item.stock}</strong> units</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{item.reorderThreshold}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                      item.status === 'in_stock' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : item.status === 'low_stock' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[var(--secondary-hover)]"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Audit History */}
      <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <h3 className="mb-4 flex flex-wrap items-center gap-2 text-base font-bold text-[var(--primary)]">
          <History size={18} /> Recent Stock Movement Logs (Audit Trail)
        </h3>
        <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Product</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Change</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Previous → New</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Type</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Reason</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m._id}>
                  <td className="border-b border-[var(--border)] px-4 py-3"><strong>{m.product?.name || 'Product'}</strong></td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <strong className={m.changeQuantity > 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}>
                      {m.changeQuantity > 0 ? `+${m.changeQuantity}` : m.changeQuantity}
                    </strong>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{m.previousStock} → {m.newStock}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3"><span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{m.movementType}</span></td>
                  <td className="border-b border-[var(--border)] px-4 py-3 text-[13px]">{m.reason}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)]">
                    {new Date(m.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-xl border border-[var(--border)] bg-white p-5 shadow-xl sm:p-7">
            <h2 className="mb-2.5 text-lg font-extrabold text-[var(--primary)]">
              Adjust Stock: {selectedProduct.name}
            </h2>
            <p className="mb-5 text-[13px] text-[var(--text-secondary)]">
              Current stock: <strong>{selectedProduct.stock}</strong> units
            </p>

            <form onSubmit={handleAdjust}>
              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Stock Change Quantity (+ or -)</label>
                <input
                  type="number"
                  required
                  value={changeQty}
                  onChange={(e) => setChangeQty(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-xs text-[var(--text-muted)]">
                  Enter positive (e.g. 10) to add stock, or negative (e.g. -2) to deduct.
                </span>
              </div>

              <div className="mb-6 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Audit Reason (Mandatory)</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2.5">
                <button type="button" onClick={() => setSelectedProduct(null)} className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-[18px] py-2.5 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)]">
                  Cancel
                </button>
                <button type="submit" disabled={adjusting} className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)] disabled:opacity-60">
                  {adjusting ? 'Saving...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}