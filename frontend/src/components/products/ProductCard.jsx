import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.reorderThreshold || 5);
  const isOutOfStock = product.stock === 0;
  const cartItem = cart.items.find((item) => item.product?._id === product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add items to your cart');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:shadow-md">
      <Link to={`/products/${product._id}`} className="relative block w-full bg-slate-100 pt-[80%]">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={product.name}
          className="absolute left-0 top-0 h-full w-full object-cover"
        />
        {hasDiscount && (
          <span className="absolute left-2.5 top-2.5 rounded bg-[var(--error)] px-2 py-0.5 text-[11px] font-bold text-white">
            -{discountPercent}%
          </span>
        )}
        {isLowStock && (
          <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded bg-[var(--warning)] px-2 py-0.5 text-[11px] font-bold text-white">
            <AlertCircle size={12} /> Only ${product.stock} left
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-sm font-bold text-white">
            OUT OF STOCK
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
            {product.category?.name || 'General'}
          </span>
          <Link to={`/products/${product._id}`}>
            <h3 className="mb-2 mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--text-main)]">
              {product.name}
            </h3>
          </Link>
          <div className="mb-3 flex items-center gap-1.5">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span className="text-[13px] font-semibold">{product.rating || '4.5'}</span>
            <span className="text-xs text-[var(--text-muted)]">({product.numReviews || 12})</span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5">
          <div>
            <div className="text-lg font-bold text-[var(--primary)]">
              ₹{displayPrice.toLocaleString('en-IN')}
            </div>
            {hasDiscount && (
              <div className="text-xs text-[var(--text-muted)] line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${isOutOfStock ? 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] hover:bg-[var(--surface-alt)]' : 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)]'}`}
            aria-label={cartItem ? `${product.name}, ${cartItem.quantity} in cart` : `Add ${product.name} to cart`}
          >
            <ShoppingBag size={14} />
            {adding ? '...' : (cartItem ? `Added (${cartItem.quantity})` : 'Add')}
          </button>
        </div>
      </div>
    </div>
  );
}