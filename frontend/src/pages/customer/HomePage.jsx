import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
  const { isAdmin } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=8'),
          api.get('/categories')
        ]);
        setFeaturedProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--primary)] py-12 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-10 px-3.5 sm:px-5">
          <div className="min-w-0 flex-[1_1_500px]">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--accent)]">
              <Sparkles size={14} /> Next-Gen E-Commerce & Inventory Platform
            </span>
            <h1 className="mb-5 !text-4xl font-extrabold leading-tight tracking-tight text-white sm:!text-[46px]">
              Premium Products, <br />
              <span className="text-[var(--accent)]">Real-Time Inventory</span> Control.
            </h1>
            <p className="mb-8 max-w-[540px] text-base text-slate-400 sm:text-[17px]">
              Explore certified top-brand gadgets, apparel, and lifestyle gear with instant checkout, live stock audit trails, and mock payment simulations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--secondary-hover)]">
                Shop Catalog <ArrowRight size={18} />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-transparent px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-[1_1_400px] justify-center">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
              alt="Hero Headphone"
              className="w-full max-w-[450px] rounded-2xl border border-slate-800 shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)] py-12">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-5">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="!text-2xl font-bold text-[var(--primary)]">Browse Categories</h2>
            <Link to="/products" className="shrink-0 text-sm font-semibold text-[var(--secondary)] hover:text-[var(--secondary-hover)]">
              View All →
            </Link>
          </div>

          <div className="flex gap-3.5 overflow-x-auto pb-2.5">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm font-semibold text-[var(--text-main)] shadow-sm transition hover:shadow-md"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--secondary)]" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-[60px]">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-5">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="!text-2xl font-bold text-[var(--primary)] sm:!text-[26px]">Trending Products</h2>
              <p className="text-sm text-[var(--text-secondary)]">Hand-picked top-rated products from our active database</p>
            </div>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] transition hover:border-[var(--text-secondary)] hover:bg-[var(--surface-alt)]">
              Explore All Products
            </Link>
          </div>

          {loading ? (
            <div className="py-[60px] text-center text-[var(--text-secondary)]">Loading catalog...</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-blue-200 bg-[var(--accent-light)] p-6 sm:p-9">
            <div>
              <span className="mb-2 inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[var(--secondary)]">LIMITED TIME OFFER</span>
              <h3 className="mb-1.5 text-xl font-extrabold text-[var(--primary)] sm:text-2xl">
                Use Code <span className="tracking-wider text-[var(--secondary)]">WELCOME10</span> for 10% Extra OFF
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Or use code <strong>FLAT200</strong> on orders above ₹1,500. Valid across all electronics and apparel.
              </p>
            </div>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-[var(--secondary-hover)]">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}