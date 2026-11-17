import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-3.5 py-20 text-center sm:px-5">
        <ShoppingBag size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
        <h2 className="mb-2 text-2xl font-bold text-[var(--primary)]">Your Shopping Cart is Waiting</h2>
        <p className="mb-6 text-[var(--text-secondary)]">Please login to view or checkout your items.</p>
        <Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white transition hover:bg-[var(--secondary-hover)]">Login Now</Link>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-3.5 py-20 text-center sm:px-5">
        <ShoppingBag size={56} className="mx-auto mb-4 text-[var(--text-muted)]" />
        <h2 className="text-2xl font-extrabold text-[var(--primary)]">Your Cart is Empty</h2>
        <p className="mb-6 mt-2 text-[var(--text-secondary)]">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white transition hover:bg-[var(--secondary-hover)]">Discover Products</Link>
      </div>
    );
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await api.get(`/coupons/validate/${couponCode.trim()}?subtotal=${cart.subtotal}`);
      setAppliedCoupon(res.data);
    } catch (err) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = cart.subtotal > 1500 ? 0 : 99;
  const taxAmount = Math.round((cart.subtotal - discountAmount) * 0.05);
  const totalAmount = Math.max(0, cart.subtotal - discountAmount + shippingFee + taxAmount);

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-8 sm:px-5 sm:py-10">
      <h1 className="mb-6 text-2xl font-extrabold text-[var(--primary)] sm:text-[28px]">
        Shopping Cart ({cart.itemCount} items)
      </h1>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex flex-col items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:flex-row sm:items-center sm:gap-5">
                <img
                  src={item.product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                  alt={item.product.name}
                  className="h-[90px] w-[90px] rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <Link to={`/products/${item.product._id}`}>
                    <h3 className="mb-1 text-base font-semibold text-[var(--text-main)]">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="mb-2 text-[13px] text-[var(--text-muted)]">
                    SKU: {item.product.sku}
                  </div>
                  <div className="text-base font-bold text-[var(--primary)]">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center rounded-md border border-[var(--border)]">
                  <button
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                    className="p-1.5 hover:bg-[var(--surface-alt)]"
                    aria-label={`Decrease ${item.product.name} quantity`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="p-1.5 hover:bg-[var(--surface-alt)]"
                    aria-label={`Increase ${item.product.name} quantity`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="w-[90px] text-left text-base font-bold sm:text-right">
                  ₹{item.itemTotal.toLocaleString('en-IN')}
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="p-1.5 text-[var(--error)] hover:bg-red-50"
                  title="Remove item"
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <Link to="/products" className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)]">← Continue Shopping</Link>
            <button onClick={clearCart} className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--error)] hover:bg-red-50">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-bold text-[var(--primary)]">Order Summary</h2>

          <form onSubmit={handleApplyCoupon} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Promo code (e.g. WELCOME10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
            />
            <button type="submit" disabled={validatingCoupon} className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)] disabled:opacity-60">
              Apply
            </button>
          </form>

          {appliedCoupon && (
            <div className="mb-4 flex items-center gap-1.5 rounded-md border border-emerald-200 bg-[var(--success-bg)] px-3.5 py-2.5 text-[13px] text-[var(--success)]">
              <CheckCircle size={16} /> Code <strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discountAmount})
            </div>
          )}

          {couponError && (
            <div className="mb-4 text-[13px] text-[var(--error)]">
              {couponError}
            </div>
          )}

          <div className="mb-4 flex flex-col gap-3 border-b border-[var(--border)] pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Items Subtotal</span>
              <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-[var(--success)]">
                <span>Coupon Discount</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Estimated Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-[var(--success)]">FREE</strong> : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Tax (5% GST)</span>
              <span>₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mb-6 flex justify-between text-lg font-extrabold text-[var(--primary)]">
            <span>Total Amount</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => navigate('/checkout', { state: { couponCode: appliedCoupon?.code } })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--secondary-hover)] sm:text-base"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}