import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Wind, MailCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const { resendVerification, verifyEmailToken } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>(
    token ? 'verifying' : 'idle'
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    let active = true;
    const run = async () => {
      const result = await verifyEmailToken(token);
      if (!active) return;
      if (result.success) {
        setStatus('verified');
        setMessage(result.message || 'Email verified. You can now log in.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Verification failed.');
      }
    };
    run();

    return () => {
      active = false;
    };
  }, [token, verifyEmailToken]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    const result = await resendVerification(email);
    setIsSubmitting(false);
    setStatus(result.success ? 'idle' : 'error');
    setMessage(
      result.success
        ? result.message || 'If this email exists, a verification link was sent.'
        : result.error || 'Could not resend verification email.'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Wind className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-semibold tracking-tight text-white">SIBOlytics</span>
      </Link>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <MailCheck className="w-5 h-5 text-blue-300" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Verify your email</h2>
        </div>

        {status === 'verifying' && (
          <p className="text-slate-300">Verifying your email link...</p>
        )}

        {message && (
          <div
            className={`mt-4 text-sm rounded-xl p-3 border ${
              status === 'verified'
                ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                : 'text-red-300 bg-red-500/10 border-red-500/20'
            }`}
          >
            {message}
          </div>
        )}

        {status !== 'verified' && (
          <form onSubmit={handleResend} className="space-y-4 mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Resend verification email'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
