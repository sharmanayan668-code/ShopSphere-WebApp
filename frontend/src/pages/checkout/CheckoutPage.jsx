import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Truck, Lock, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const couponCode = location.state?.couponCode || '';

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '9876543210',
    addressLine1: '402, Lotus Tech Park, Link Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400069',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('mock_card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-3.5 py-20 text-center sm:px-5">
        <h2 className="mb-2 text-2xl font-bold text-[var(--primary)]">No items to checkout</h2>
        <Link to="/products" className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)]">Go to Store</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Server recalculates all prices, validates stock and coupon
      const res = await api.post('/orders', {
        shippingAddress: address,
        couponCode: couponCode || undefined,
        paymentMethod
      });

      const order = res.data;
      await refreshCart(); // Cart is now empty in backend

      // Navigate to Mock Payment Simulation page
      navigate(`/payment/${order._id}`, { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-8 sm:px-5 sm:py-10">
      <h1 className="mb-6 text-2xl font-extrabold text-[var(--primary)] sm:text-[28px]">
        Complete Your Order
      </h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-[var(--error-bg)] px-4 py-3.5 text-sm text-[var(--error)]">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        
        {/* Left: Shipping Address & Payment Selection */}
        <div>
          <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--primary)]">
              <Truck size={20} color="var(--secondary)" /> 1. Shipping Address
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[var(--text-main)]">Street / Flat / Area</label>
              <input
                type="text"
                required
                value={address.addressLine1}
                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">State</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-main)]">Postal / PIN Code</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--primary)]">
              <Lock size={20} color="var(--secondary)" /> 2. Payment Method
            </h2>

            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] p-3.5">
                <input
                  type="radio"
                  name="pay"
                  value="mock_card"
                  checked={paymentMethod === 'mock_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Mock Credit / Debit Card (Simulation)</strong>
                  <div className="text-xs text-[var(--text-secondary)]">Instant simulated payment verification</div>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] p-3.5">
                <input
                  type="radio"
                  name="pay"
                  value="mock_upi"
                  checked={paymentMethod === 'mock_upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Mock UPI / QR (Simulation)</strong>
                  <div className="text-xs text-[var(--text-secondary)]">Simulate Google Pay / PhonePe / Paytm</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Review & Submit */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--primary)]">Review Items</h2>

          <div className="mb-5 flex max-h-[240px] flex-col gap-3 overflow-y-auto">
            {cart.items.map((i) => (
              <div key={i.product._id} className="flex justify-between gap-3 text-[13px]">
                <span className="text-[var(--text-secondary)]">
                  {i.quantity}x {i.product.name}
                </span>
                <strong>₹{i.itemTotal.toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>

          <div className="mb-6 border-t border-[var(--border)] pt-4">
            {couponCode && (
              <div className="mb-2 text-[13px] text-[var(--success)]">
                Coupon Applied: <strong>{couponCode}</strong>
              </div>
            )}
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
              Final amount & taxes are recalculated on the server.
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--secondary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {submitting ? 'Creating Order...' : 'Confirm & Proceed to Pay'} <ArrowRight size={18} />
          </button>
        </div>

      </form>
    </div>
  );
}