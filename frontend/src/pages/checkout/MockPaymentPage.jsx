import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ShieldAlert, CheckCircle, XCircle, Package } from 'lucide-react';

export default function MockPaymentPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loadingOrder, setLoadingOrder] = useState(!order);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fixed Idempotency Key for this payment session
  const [idempotencyKey] = useState(`IDEMP-${orderId}-${Date.now()}`);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${orderId}`);
          setOrder(res.data);
        } catch (err) {
          setErrorMsg(err.message);
        } finally {
          setLoadingOrder(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, order]);

  if (loadingOrder) return <div className="mx-auto max-w-7xl px-3.5 py-20 text-center sm:px-5">Loading payment session...</div>;
  if (!order) return <div className="mx-auto max-w-7xl px-3.5 py-20 text-center sm:px-5">Order not found</div>;

  const handleSimulate = async (scenario) => {
    setProcessing(true);
    setErrorMsg('');
    try {
      const res = await api.post('/payments/simulate', {
        orderId: order._id,
        scenario,
        idempotencyKey
      });
      setResult(res);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[780px] px-3.5 py-8 sm:px-5 sm:py-10">
      
      {/* Simulation Warning Banner */}
      <div className="mb-[30px] flex items-center gap-3.5 rounded-xl border border-amber-300 bg-amber-100 px-4 py-4 text-amber-800 sm:px-5">
        <ShieldAlert size={28} className="shrink-0" />
        <div>
          <strong className="text-[15px]">DEMONSTRATION MOCK PAYMENT GATEWAY</strong>
          <p className="mt-0.5 text-[13px]">
            This is an academic simulation for internship evaluation. No real bank accounts or credit cards are involved.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8">
        
        {/* Order Details */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <span className="text-[13px] text-[var(--text-secondary)]">Order Number</span>
            <h2 className="text-xl font-extrabold text-[var(--primary)]">{order.orderNumber}</h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[13px] text-[var(--text-secondary)]">Payable Amount</span>
            <div className="text-2xl font-extrabold text-[var(--secondary)] sm:text-[28px]">
              ₹{order.totalAmount?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Idempotency Key Info */}
        <div className="mb-7 break-all rounded-md bg-[var(--surface-alt)] px-3 py-2 text-xs text-[var(--text-muted)]">
          Session Idempotency Key: <code>{idempotencyKey}</code>
        </div>

        {/* If result is obtained */}
        {result ? (
          <div className="py-5 text-center">
            {result.success ? (
              <div>
                <CheckCircle size={56} className="mx-auto mb-4 text-[var(--success)]" />
                <h3 className="text-[22px] font-extrabold text-[var(--success)]">Payment Successful!</h3>
                <p className="my-2 mb-6 text-[var(--text-secondary)]">
                  {result.message} <br />
                  Ref: <code>{result.data?.payment?.transactionRef}</code>
                </p>
                <Link to="/orders" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--secondary-hover)]">
                  <Package size={18} /> View In My Orders
                </Link>
              </div>
            ) : (
              <div>
                <XCircle size={56} className="mx-auto mb-4 text-[var(--error)]" />
                <h3 className="text-[22px] font-extrabold text-[var(--error)]">Payment Failed!</h3>
                <p className="my-2 mb-6 text-[var(--text-secondary)]">
                  {result.message || 'The simulated bank declined this transaction.'}
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setResult(null)} className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary)] px-[18px] py-2.5 text-sm font-medium text-white hover:bg-[var(--secondary-hover)]">
                    Try Again
                  </button>
                  <Link to="/orders" className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-[18px] py-2.5 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--surface-alt)]">
                    View Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-base font-bold text-[var(--text-main)]">Choose a Simulation Outcome:</h3>
            
            <div className="flex flex-col gap-3.5">
              
              {/* Option 1: SUCCESS */}
              <button
                onClick={() => handleSimulate('success')}
                disabled={processing}
                className="flex w-full items-center justify-between gap-4 rounded-lg bg-[var(--success)] px-5 py-3 text-left text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>✓ 1. Simulate Successful Payment</span>
                <span className="text-right text-xs opacity-[0.85]">Marks order as Confirmed</span>
              </button>

              {/* Option 2: FAILURE */}
              <button
                onClick={() => handleSimulate('failure')}
                disabled={processing}
                className="flex w-full items-center justify-between gap-4 rounded-lg bg-[var(--error)] px-5 py-3 text-left text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>✕ 2. Simulate Bank Decline / Failure</span>
                <span className="text-right text-xs opacity-[0.85]">Leaves order pending for retry</span>
              </button>

              {/* Option 3: DUPLICATE */}
              <button
                onClick={() => handleSimulate('success')}
                disabled={processing}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-white px-5 py-3 text-left text-[var(--text-main)] transition hover:bg-[var(--surface-alt)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>⚡ 3. Test Idempotency (Repeat Event)</span>
                <span className="text-right text-xs text-[var(--text-secondary)]">Prevents duplicate billing</span>
              </button>

            </div>

            {errorMsg && (
              <div className="mt-5 text-sm text-[var(--error)]">
                {errorMsg}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}