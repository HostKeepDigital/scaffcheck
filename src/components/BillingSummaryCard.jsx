import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, CalendarClock, Repeat, ArrowUpRight, Receipt } from 'lucide-react';
import { PLANS, planLimit, annualSaving } from '@/lib/stripePrices';
import OperativeUsageBar from '@/components/OperativeUsageBar';
import DowngradeLimitNotice from '@/components/DowngradeLimitNotice';

const STATUS = {
  trial_active: { label: 'Trial active', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  active: { label: 'Active', cls: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30' },
  lapsed: { label: 'Lapsed', cls: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30' },
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BillingSummaryCard({ account, onManage, busy, ragCounts }) {
  const plan = PLANS.find((p) => p.id === account.plan) || PLANS[0];
  const billing = account.billing === 'annual' ? 'annual' : 'monthly';
  const status = STATUS[account.subscription_status] || STATUS.trial_active;
  const limit = planLimit(account.plan);
  const isTrial = account.subscription_status === 'trial_active';
  const renewalDate = isTrial ? account.trial_ends_at : account.current_period_end;
  const cycleWord = billing === 'annual' ? 'year' : 'month';

  return (
    <Card>
      <CardContent className="p-0">
        {/* Plan summary */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CreditCard className="w-4 h-4" /> Billing
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">{plan.name}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${status.cls}`}>
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {plan[billing].priceLabel}
                <span className="text-sm font-normal text-muted-foreground">
                  {billing === 'annual' ? '/year' : '/month'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">excl. VAT</p>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="p-5 border-b border-border">
          <OperativeUsageBar limit={limit} ragCounts={ragCounts} />
        </div>

        {/* Billing details */}
        <div className="p-5 border-b border-border space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Repeat className="w-4 h-4" /> Billing cycle
            </span>
            <span className="font-semibold text-foreground capitalize">{billing}</span>
          </div>
          {billing === 'monthly' && annualSaving(plan) > 0 && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Switch to annual billing and save £{annualSaving(plan)} a year.
            </p>
          )}
          {renewalDate && (
            <div className="flex items-start justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="w-4 h-4" /> {isTrial ? 'First payment due' : 'Next renewal due'}
              </span>
              <span className="font-semibold text-foreground text-right">{fmtDate(renewalDate)}</span>
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="w-4 h-4" /> {isTrial ? 'Amount at first payment' : 'Amount at renewal'}
            </span>
            <span className="font-semibold text-foreground text-right">
              {plan[billing].priceLabel}{' '}
              <span className="font-normal text-muted-foreground">per {cycleWord}</span>
            </span>
          </div>
          {isTrial && (
            <p className="text-xs text-muted-foreground">
              Your free trial runs until then. You won't be charged before that date, and your {plan.name}{' '}
              subscription starts automatically afterwards unless you cancel.
            </p>
          )}
          {!isTrial && !renewalDate && (
            <p className="text-xs text-muted-foreground">
              Your exact renewal date will appear here after your next billing update.
            </p>
          )}
          {account.subscription_status === 'lapsed' && (
            <p className="text-xs text-red-600 dark:text-red-400">
              Your subscription has lapsed. Update your payment details to restore access.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 space-y-3">
          <div className="space-y-1">
            {isTrial && (
              <p className="text-xs text-muted-foreground">Changing plan won't affect your free trial.</p>
            )}
            <p className="text-xs text-muted-foreground">
              {isTrial ? 'Post-trial, upgrades' : 'Upgrades'} apply straight away and you're charged only the difference
              for the rest of the period; downgrades start at your next renewal.
            </p>
          </div>
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold h-11"
            onClick={onManage}
            disabled={busy}
          >
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowUpRight className="w-4 h-4 mr-2" />}
            {isTrial ? 'Manage billing & invoices' : <>Manage subscription &amp; billing</>}
          </Button>
          <DowngradeLimitNotice operativeCount={account.operative_count || 0} />
        </div>
      </CardContent>
    </Card>
  );
}