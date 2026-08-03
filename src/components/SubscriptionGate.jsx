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

  // No account set up yet — send them to settings to create one
  if (!account) {
    return <Navigate to="/settings" replace />;
  }

  // Trial or paid subscribers get straight through to the dashboard
  if (account.subscription_status === 'trial_active' || account.subscription_status === 'active') {
    return <Outlet />;
  }

  // Anything else (lapsed) is blocked
  return <Navigate to="/paywall" replace />;
}