
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[var(--primary)] pb-6 pt-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-5">
        <div className="grid grid-cols-1 gap-8 border-b border-slate-700 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Truck size={28} color="#60A5FA" />
            <h3 className="mb-2 mt-3 text-white">
              Convenient Delivery
            </h3>
            <p className="text-sm leading-relaxed">
              Enjoy a smooth and convenient shopping experience.
            </p>
          </div>

          <div>
            <ShieldCheck size={28} color="#60A5FA" />
            <h3 className="mb-2 mt-3 text-white">
              Secure Shopping
            </h3>
            <p className="text-sm leading-relaxed">
              Shop with confidence through a simple checkout process.
            </p>
          </div>

          <div>
            <RefreshCw size={28} color="#60A5FA" />
            <h3 className="mb-2 mt-3 text-white">
              Easy Order Management
            </h3>
            <p className="text-sm leading-relaxed">
              Track and manage your orders with ease.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-7">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={25} color="#60A5FA" />
            <span className="text-xl font-extrabold text-white">
              Shop<span className="text-blue-400">Sphere</span>
            </span>
          </div>
          <p className="text-center text-[13px] leading-relaxed">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
