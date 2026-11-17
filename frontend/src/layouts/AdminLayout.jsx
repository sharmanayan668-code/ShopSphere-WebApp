import { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div className="p-[60px] text-center">Authenticating admin access...</div>;
  }

  if (!user || !isAdmin) {
    alert('Access Denied: Administrator role required');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative flex min-h-screen bg-slate-50">
      <div className={`fixed inset-y-0 left-0 z-[1000] flex shrink-0 shadow-xl transition-transform duration-300 min-[841px]:static min-[841px]:z-auto min-[841px]:translate-x-0 min-[841px]:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[999] bg-slate-900/55 backdrop-blur-sm min-[841px]:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-[var(--border)] bg-white px-4 sm:px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex p-1.5 text-[var(--text-main)] min-[841px]:hidden"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="text-sm text-[var(--text-secondary)]">
              Admin: <strong>{user?.name}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)]">
              <ArrowLeft size={14} /> Storefront
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}