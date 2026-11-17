import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [adminLoginPending, setAdminLoginPending] = useState(false);

  useEffect(() => {
    if (adminLoginPending && isAdmin) navigate('/admin');
  }, [adminLoginPending, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (adminMode) {
        setAdminLoginPending(true);
      } else if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const displayedError = error || (
    adminLoginPending && !isAdmin
      ? 'Administrator access is restricted to authorized accounts.'
      : ''
  );

  return (
    <div className="mx-auto w-full max-w-[440px] px-3.5 py-10 sm:px-5 sm:py-[60px]">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--secondary)] text-white">
            {adminMode ? <ShieldCheck size={24} /> : <ShoppingBag size={24} />}
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--primary)]">
            {adminMode ? 'Administrator Access' : 'Welcome Back'}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {adminMode
              ? 'Sign in with your authorized administrator account'
              : 'Login to your ShopSphere customer or admin account'}
          </p>
        </div>

        {displayedError && (
          <div className="mb-[18px] rounded-md border border-red-200 bg-[var(--error-bg)] px-3.5 py-2.5 text-[13px] text-[var(--error)]">
            {displayedError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            <label className="text-[13px] font-medium text-[var(--text-main)]">Password</label>
            <input
              type="password"
              required
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
            {loading ? 'Logging in...' : adminMode ? 'Sign In as Administrator' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setAdminMode(!adminMode);
            setAdminLoginPending(false);
            setError('');
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--secondary)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShieldCheck size={17} />
          {adminMode ? 'Back to Customer Login' : 'Administrator Access'}
        </button>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[var(--secondary)] hover:text-[var(--secondary-hover)]">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}