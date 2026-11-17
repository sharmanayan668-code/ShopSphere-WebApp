import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[440px] px-3.5 py-10 sm:px-5 sm:py-[60px]">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--secondary)] text-white">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--primary)]">Create Account</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Join ShopSphere for seamless ordering and tracking
          </p>
        </div>

        {error && (
          <div className="mb-[18px] rounded-md border border-red-200 bg-[var(--error-bg)] px-3.5 py-2.5 text-[13px] text-[var(--error)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[var(--text-main)]">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[var(--text-main)]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="mb-6 flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[var(--text-main)]">Password (min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--secondary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--secondary)] hover:text-[var(--secondary-hover)]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}