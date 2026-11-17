import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Plus, Minus } from 'lucide-react';
import NotFound from '../../NotFound';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      const [prodRes, revRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`)
      ]);
      setProduct(prodRes.data);
      setReviews(revRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-7xl px-3.5 py-20 text-center sm:px-5">Loading product details...</div>;
  if (!product) return <NotFound />;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to purchase or add items to your cart');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      setMsg('Added to Cart Successfully! ✓');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    try {
      setSubmittingReview(true);
      await api.post(`/reviews/product/${id}`, { rating, comment });
      setComment('');
      fetchProduct();
      alert('Thank you! Your review has been recorded.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-8 sm:px-5 sm:py-10">
      <div className="mb-6 text-[13px] text-[var(--text-secondary)]">
        <Link to="/" className="hover:text-[var(--secondary)]">Home</Link> / <Link to="/products" className="hover:text-[var(--secondary)]">Store</Link> / <span>{product.name}</span>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
            alt={product.name}
            className="h-[320px] w-full object-cover sm:h-[420px]"
          />
        </div>

        <div>
          <span className="mb-3 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[var(--secondary)]">
            {product.category?.name || 'General Category'}
          </span>
          <h1 className="mb-2 text-2xl font-extrabold leading-tight text-[var(--primary)] sm:text-[28px]">
            {product.name}
          </h1>
          <div className="mb-4 text-xs text-[var(--text-muted)]">
            SKU: <strong className="text-[var(--text-main)]">{product.sku}</strong>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <strong className="text-[15px]">{product.rating || '4.5'}</strong>
            </div>
            <span className="text-[13px] text-[var(--text-muted)]">
              ({reviews.length} customer reviews)
            </span>
          </div>

          <div className="mb-6 flex flex-wrap items-baseline gap-3.5">
            <span className="text-3xl font-extrabold text-[var(--primary)] sm:text-[32px]">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-lg text-[var(--text-muted)] line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--success)]">
                ✓ In Stock ({product.stock} units ready to ship)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--error)]">
                ✕ Out of stock
              </span>
            )}
          </div>

          <p className="mb-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {product.description}
          </p>

          {product.stock > 0 && (
            <div className="mb-[30px] flex flex-wrap items-center gap-5">
              <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 hover:bg-[var(--surface-alt)]"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2.5 text-[15px] font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-2.5 hover:bg-[var(--surface-alt)]"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--secondary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingBag size={20} />
                {adding ? 'Adding...' : (msg || 'Add To Cart')}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5 border-t border-[var(--border)] pt-6">
            <div className="text-center text-xs text-[var(--text-secondary)]">
              <Truck size={20} className="mx-auto mb-1 text-[var(--secondary)]" />
              <div>Fast Shipping</div>
            </div>
            <div className="text-center text-xs text-[var(--text-secondary)]">
              <ShieldCheck size={20} className="mx-auto mb-1 text-[var(--secondary)]" />
              <div>Idempotent Mock Pay</div>
            </div>
            <div className="text-center text-xs text-[var(--text-secondary)]">
              <RefreshCw size={20} className="mx-auto mb-1 text-[var(--secondary)]" />
              <div>Easy Cancellations</div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-[var(--border)] pt-10">
        <h2 className="mb-6 text-[22px] font-bold text-[var(--primary)]">Customer Reviews</h2>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            {reviews.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                    <div className="mb-1.5 flex items-center justify-between">
                      <strong className="text-sm">{r.user?.name || 'Verified Buyer'}</strong>
                      <div className="flex gap-0.5">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 text-base font-bold text-[var(--primary)]">Leave a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Rating</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20">
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Poor)</option>
                    <option value={1}>⭐ (1 - Terrible)</option>
                  </select>
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[var(--text-main)]">Comment</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the build quality, performance..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[var(--secondary-hover)] disabled:opacity-60">
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <p className="text-[13px] text-[var(--text-secondary)]">
                Please <Link to="/login" className="font-semibold text-[var(--secondary)]">login</Link> to post a review.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}