
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  LogOut,
  Shield,
  Package,
  Menu,
  X
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex min-h-[72px] max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-3.5 py-3 sm:px-5 min-[841px]:flex-nowrap min-[841px]:py-0">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex rounded-[10px] bg-[var(--secondary)] p-2 text-white">
            <ShoppingBag size={20} />
          </div>
          <span className="text-lg font-extrabold tracking-[-0.5px] text-[var(--primary)]">
            Shop<span className="text-[var(--secondary)]">Sphere</span>
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="order-3 relative w-full basis-full min-[841px]:order-none min-[841px]:w-auto min-[841px]:max-w-[420px] min-[841px]:flex-[1_1_380px]"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] py-2 pl-10 pr-4 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20 min-[841px]:h-[38px] min-[841px]:text-[13px]"
          />
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        </form>

        <nav className="hidden items-center gap-4 min-[841px]:flex">
          <Link to="/products" className="text-sm font-medium text-[var(--text-main)] hover:text-[var(--secondary)]">Store</Link>
          <Link to="/cart" className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-main)] hover:text-[var(--secondary)]">
            <ShoppingBag size={18} />
            Cart
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--secondary)] px-1.5 py-0.5 text-xs font-semibold text-white">{itemCount}</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link to="/orders" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] transition hover:border-[var(--text-secondary)] hover:bg-[var(--surface-alt)]">
                <Package size={14} />
                My Orders
              </Link>

              {isAdmin && (
                <Link to="/admin" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-[13px] font-medium text-white transition hover:-translate-y-px hover:bg-[var(--secondary-hover)]">
                  <Shield size={14} />
                  Admin
                </Link>
              )}

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] transition hover:border-[var(--text-secondary)] hover:bg-[var(--surface-alt)]"
                title="Logout"
                type="button"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-[var(--text-main)] hover:text-[var(--secondary)]">Login</Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-[13px] font-medium text-white transition hover:-translate-y-px hover:bg-[var(--secondary-hover)]">
                Register
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3 min-[841px]:hidden">
          <Link to="/cart" className="relative inline-flex items-center justify-center rounded-lg p-2 text-[var(--primary)] hover:bg-[var(--surface-alt)]" aria-label={`Cart, ${itemCount} items`}>
            <ShoppingBag size={20} />
            <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--secondary)] px-1 text-[10px] font-semibold leading-5 text-white">{itemCount}</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="inline-flex items-center justify-center rounded-lg p-2 text-[var(--primary)] hover:bg-[var(--surface-alt)]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mx-auto flex max-h-[calc(100vh-7rem)] w-full max-w-7xl flex-col gap-1 overflow-y-auto border-t border-[var(--border)] px-3.5 py-3 sm:px-5 min-[841px]:hidden">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)] hover:text-[var(--secondary)]"
          >
            All Products Catalog
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)] hover:text-[var(--secondary)]"
          >
            My Shopping Cart
          </Link>

          {user ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)] hover:text-[var(--secondary)]"
              >
                My Orders History
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)] hover:text-[var(--secondary)]"
                >
                  Admin Control Portal
                </Link>
              )}

              <div className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-[var(--text-secondary)]">
                  Signed in as <strong>{user.name}</strong>
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] transition hover:border-[var(--text-secondary)] hover:bg-[var(--surface-alt)] sm:self-auto"
                  type="button"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1 border-t border-[var(--border)] pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)] hover:text-[var(--secondary)]"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)] hover:text-[var(--secondary)]"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-900/65 p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-[380px] rounded-2xl bg-[var(--surface)] p-7 text-center shadow-2xl"
          >
            <div className="flex items-center justify-center">
              <LogOut size={35} color="var(--error)" />
            </div>
            <h3 id="logout-title" className="mb-2 mt-4 text-xl font-bold text-[var(--primary)]">
              Confirm Logout
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Are you sure you want to logout from your account?
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-[18px] py-2.5 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--text-secondary)] hover:bg-[var(--surface-alt)]"
                onClick={() => setShowLogoutConfirm(false)}
                type="button"
              >
                Cancel
              </button>

              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--error)] px-[18px] py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                onClick={handleLogout}
                type="button"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
