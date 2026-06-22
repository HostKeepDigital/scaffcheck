import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useAccount } from '@/lib/AccountContext';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building2, CreditCard, Check, AlertCircle, Trash2 } from 'lucide-react';
import { PLANS } from '@/lib/stripePrices';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { user, logout } = useAuth();
  const { account, loading, refreshAccount } = useAccount();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('founding');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleStartTrial = async () => {
    setError('');
    if (window.self !== window.top) {
      setError('Checkout works only from a published app. Please publish your app to complete checkout.');
      return;
    }
    if (!companyName.trim()) { setError('Please enter your company name'); return; }
    setSaving(true);
    try {
      const response = await base44.functions.invoke('stripeCheckout', {
        plan: selectedPlan,
        company_name: companyName,
        user_id: user.id,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to start checkout');
      }
    } catch (err) {
      setError(err.message || 'Failed to start trial');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateName = async () => {
    if (!companyName.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Account.update(account.id, { company_name: companyName });
      await refreshAccount();
      setCompanyName('');
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    setError('');
    if (window.self !== window.top) {
      setError('Billing portal works only from a published app. Please publish your app to manage billing.');
      return;
    }
    setSaving(true);
    try {
      const response = await base44.functions.invoke('stripePortal', { user_id: user.id });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      setError(err.message || 'Failed to open billing portal');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    try {
      await base44.functions.invoke('deleteAccount', {});
      logout(false);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground/70" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
          </div>
        )}

        {!account ? (
          /* Setup: no account yet */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Your Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company name</Label>
                  <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Scaffolding Ltd" autoFocus />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Choose Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLANS.map((plan) => (
                    <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                      className={`text-left p-4 rounded-xl border-2 transition ${selectedPlan === plan.id ? 'border-amber-500 bg-amber-500/10' : 'border-border hover:border-amber-500/50'}`}>
                      {plan.badge && <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold mb-1">{plan.badge}</span>}
                      <div className="font-semibold">{plan.name}</div>
                      <div className="text-2xl font-bold mt-1">{plan.priceLabel}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span></div>
                      <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> 7-day free trial · Card required · Cancel anytime
                </div>
                <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold h-11"
                  onClick={handleStartTrial} disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Starting...</> : 'Start free trial'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Account exists */
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Company Name</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={account.company_name} />
                <Button onClick={handleUpdateName} disabled={saving || !companyName.trim()} variant="outline">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Update name'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Billing</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{account.plan}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">
                    {account.subscription_status === 'trial_active' && 'Trial active'}
                    {account.subscription_status === 'active' && 'Active'}
                    {account.subscription_status === 'lapsed' && 'Lapsed'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Operatives tracked</span>
                  <span className="font-medium">{account.operative_count}</span>
                </div>
                <Button variant="outline" className="w-full" onClick={handleManageBilling} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Manage Billing'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {account && (
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400"><Trash2 className="w-5 h-5" /> Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data, including operatives and compliance documents. This action cannot be undone.</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting}>
                    {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your company account, all operative records, all compliance documents, and all upload invites. This action is irreversible and all data will be lost. Your subscription will also be cancelled.
                  </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}