import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New product state
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    price: 999,
    discountPrice: 799,
    stock: 20,
    reorderThreshold: 5,
    images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
  });

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/products?limit=50'),
        api.get('/categories')
      ]);
      setProducts(pRes.data || []);
      setCategories(cRes.data || []);
      if (cRes.data?.length > 0 && !newProd.category) {
        setNewProd((prev) => ({ ...prev, category: cRes.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...newProd,
        images: [newProd.images]
      });
      setShowModal(false);
      fetchData();
      alert('Product created successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--primary)]">Product Catalog</h1>
          <p className="text-sm text-[var(--text-secondary)]">Add, update, or remove store products</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)]">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Product</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">SKU</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Price</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Stock</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Category</th>
                <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'} alt="" className="h-9 w-9 rounded object-cover" />
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3"><code>{p.sku}</code></td>
                  <td className="border-b border-[var(--border)] px-4 py-3">₹{p.price}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{p.stock}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">{p.category?.name || 'General'}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <button onClick={() => handleDelete(p._id)} className="rounded p-1.5 text-[var(--error)] hover:bg-red-50" title="Delete product">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-xl border border-[var(--border)] bg-white p-5 shadow-xl sm:p-7">
            <h2 className="mb-5 text-lg font-extrabold text-[var(--primary)]">Add New Product</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Product Name</label>
                <input type="text" required value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">SKU</label>
                  <input type="text" required value={newProd.sku} onChange={(e) => setNewProd({ ...newProd, sku: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Category</label>
                  <select value={newProd.category} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20">
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Price (₹)</label>
                  <input type="number" required value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Discount Price (₹)</label>
                  <input type="number" value={newProd.discountPrice} onChange={(e) => setNewProd({ ...newProd, discountPrice: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Initial Stock</label>
                  <input type="number" required value={newProd.stock} onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Low Stock Threshold</label>
                  <input type="number" value={newProd.reorderThreshold} onChange={(e) => setNewProd({ ...newProd, reorderThreshold: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Image URL</label>
                <input type="text" value={newProd.images} onChange={(e) => setNewProd({ ...newProd, images: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
              </div>

              <div className="mb-6 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Description</label>
                <textarea rows={3} required value={newProd.description} onChange={(e) => setNewProd({ ...newProd, description: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20" />
              </div>

              <div className="flex flex-wrap justify-end gap-2.5">
                <button type="button" onClick={() => setShowModal(false)} className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-[18px] py-2.5 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)]">Cancel</button>
                <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)]">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}