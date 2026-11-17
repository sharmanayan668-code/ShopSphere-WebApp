import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Ticket,
  ArrowLeft,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ onNavigate }) {
  const { logout, user } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/inventory', label: 'Inventory & Stock', icon: Layers },
    { to: '/admin/products', label: 'Product Catalog', icon: Package },
    { to: '/admin/orders', label: 'Customer Orders', icon: ShoppingBag },
    { to: '/admin/coupons', label: 'Promo Coupons', icon: Ticket },
  ];

  const handleLinkClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="flex min-h-screen w-[260px] shrink-0 flex-col bg-[var(--primary)] text-white">
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-6">
        <div className="rounded-lg bg-[var(--secondary)] p-1.5 text-white">
          <ShieldAlert size={20} />
        </div>
        <div>
          <div className="text-base font-extrabold">ShopSphere</div>
          <div className="text-[11px] font-semibold text-sky-400">ADMIN CONTROL</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={handleLinkClick}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-[var(--secondary)] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-4 py-5">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="mb-2 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Storefront
        </Link>
        <button
          onClick={() => { logout(); handleLinkClick(); }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] text-red-400 hover:bg-slate-800"
        >
          <LogOut size={16} /> Sign Out ({user?.name?.split(' ')[0]})
        </button>
      </div>
    </aside>
  );
}