import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useAccount } from '@/lib/AccountContext';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, AlertCircle, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { PLANS } from '@/lib/stripePrices';

export default function Paywall() {
  const { user } = useAuth();
  const { account, loading, refreshAccount } = useAccount();
  const navigate = useNavigate();
  const [subscribing, setSubscribing] = useState(null);
  const [error, setError] = useState('');

  const handleSubscribe = async (planId) => {
    setError('');
    if (window.self !== window.top) {
      setError('Checkout works only from a published app. Please publish your app to complete checkout.');
      return;
    }
    setSubscribing(planId);
    try {
      const response = await base44.functions.invoke('stripeCheckout', {
        plan: planId,
        company_name: account?.company_name || '',
        user_id: user.id,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      setError(err.message || 'Failed to start checkout');
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <AppHeader />
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mb-4">
            <ShieldAlert className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Subscription required</h1>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            {account?.subscription_status === 'lapsed'
              ? 'Your subscription has lapsed. Resubscribe to restore access to your operatives and compliance data.'
              : 'Your free trial has ended. Choose a plan to continue tracking your operatives\' compliance.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={plan.highlight ? 'border-2 border-amber-500' : ''}>
              <CardHeader>
                {plan.badge && <span className="inline-block w-fit px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold mb-1">{plan.badge}</span>}
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">{plan.priceLabel}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <Button className={`w-full ${plan.highlight ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
                  onClick={() => handleSubscribe(plan.id)} disabled={subscribing !== null}>
                  {subscribing === plan.id ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</> : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/settings')} className="text-slate-500">Manage account settings</Button>
        </div>
      </div>
    </div>
  );
}