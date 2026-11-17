import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import { Filter, Search, RotateCcw } from 'lucide-react';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const keyword = searchParams.get('keyword') || '';
  const selectedCat = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data || []);
        setTotal(res.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set(key, val);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-10 sm:px-5">
      <div className="mb-[30px]">
        <h1 className="text-3xl font-extrabold text-[var(--primary)]">
          {keyword ? `Search Results for "${keyword}"` : 'All Products Catalog'}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Showing {products.length} of {total} available items
        </p>
      </div>

      <div className="grid items-start gap-[30px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-base font-bold text-[var(--text-main)]">
              <Filter size={18} /> Filters
            </h3>
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[var(--secondary)] hover:text-[var(--secondary-hover)]">
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div className="mb-6 flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--text-main)]">Category</label>
            <div className="mt-2 flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-[13px]">
                <input
                  type="radio"
                  name="cat"
                  checked={!selectedCat}
                  onChange={() => updateFilter('category', '')}
                />
                All Categories
              </label>
              {categories.map((c) => (
                <label key={c._id} className="flex cursor-pointer items-center gap-2 text-[13px]">
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCat === c._id}
                    onChange={() => updateFilter('category', c._id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--text-main)]">Price Range (₹)</label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="min-w-0 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="min-w-0 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--text-main)]">Sort By</label>
            <select
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Featured (Newest)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        <main>
          {loading ? (
            <div className="py-24 text-center text-[var(--text-secondary)]">
              Loading products from database...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm sm:p-[60px]">
              <Search size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
              <h3 className="text-lg font-bold text-[var(--text-main)]">No products found</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Try adjusting your search query or reset the filters.
              </p>
              <button onClick={clearFilters} className="mt-5 inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-alt)]">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}