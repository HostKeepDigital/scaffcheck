import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '@/lib/AccountContext';

export default function SubscriptionGate() {
  const { account, loading } = useAccount();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!account) {
    return <Navigate to="/settings" replace />;
  }

  if (account.subscription_status === 'lapsed') {
    return <Navigate to="/paywall" replace />;
  }

  return <Outlet />;
}