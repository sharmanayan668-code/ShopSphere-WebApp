import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="py-12 text-center text-[var(--text-secondary)]">Loading real-time database analytics...</div>;
  if (!data) return <div className="py-12 text-center text-[var(--text-secondary)]">Failed to load analytics</div>;

  return (
    <div className="min-w-0">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-[var(--primary)]">Business Analytics & Overview</h1>
        <p className="text-sm text-[var(--text-secondary)]">Real-time statistics derived directly from MongoDB records</p>
      </div>

      {/* Low Stock Warning Banner if any */}
      {data.lowStockCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-amber-800 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <AlertTriangle size={20} />
            <strong className="break-words">{data.lowStockCount} products are running low on inventory!</strong>
          </div>
          <Link to="/admin/inventory" className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-amber-600">
            Review Stock Now →
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-2.5 flex justify-between text-[var(--text-secondary)]">
            <span className="text-[13px] font-semibold">TOTAL REVENUE</span>
            <DollarSign size={20} color="var(--success)" />
          </div>
          <div className="text-[28px] font-extrabold text-[var(--primary)]">
            ₹{data.totalRevenue?.toLocaleString('en-IN') || 0}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">Paid orders revenue</div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-2.5 flex justify-between text-[var(--text-secondary)]">
            <span className="text-[13px] font-semibold">TOTAL ORDERS</span>
            <ShoppingCart size={20} color="var(--secondary)" />
          </div>
          <div className="text-[28px] font-extrabold text-[var(--primary)]">
            {data.totalOrders}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">{data.paidOrders} confirmed & paid</div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-2.5 flex justify-between text-[var(--text-secondary)]">
            <span className="text-[13px] font-semibold">ACTIVE PRODUCTS</span>
            <Package size={20} color="var(--accent)" />
          </div>
          <div className="text-[28px] font-extrabold text-[var(--primary)]">
            {data.totalProducts}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">In 5 active categories</div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-2.5 flex justify-between text-[var(--text-secondary)]">
            <span className="text-[13px] font-semibold">TOTAL CUSTOMERS</span>
            <Users size={20} color="#8B5CF6" />
          </div>
          <div className="text-[28px] font-extrabold text-[var(--primary)]">
            {data.totalCustomers}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">Registered buyers</div>
        </div>
      </div>

      {/* Recent Orders & Top Sellers */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        
        {/* Recent Orders */}
        <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--primary)]">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-[13px] font-semibold text-[var(--secondary)]">View All →</Link>
          </div>

          <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Order No</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Customer</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Amount</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text-secondary)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td className="border-b border-[var(--border)] px-4 py-3"><strong>{o.orderNumber}</strong></td>
                    <td className="border-b border-[var(--border)] px-4 py-3">{o.user?.name || 'Customer'}</td>
                    <td className="border-b border-[var(--border)] px-4 py-3">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="border-b border-[var(--border)] px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${o.orderStatus === 'confirmed' ? 'border-blue-200 bg-blue-50 text-blue-700' : o.orderStatus === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <h3 className="mb-[18px] text-base font-bold text-[var(--primary)]">Top Selling Items</h3>
          {data.topProducts?.length === 0 ? (
            <p className="text-[13px] text-[var(--text-secondary)]">Place demo orders to see real-time sales volume.</p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {data.topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2 text-[13px]">
                  <div className="min-w-0">
                    <strong className="break-words">{p.name}</strong>
                    <div className="text-[var(--text-muted)]">{p.totalSold} units sold</div>
                  </div>
                  <strong className="shrink-0 text-[var(--primary)]">₹{p.totalRevenue?.toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}