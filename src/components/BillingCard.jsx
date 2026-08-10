import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Users, CalendarClock, Repeat, ArrowUpRight } from 'lucide-react';
import { PLANS, planLimit, annualSaving } from '@/lib/stripePrices';

const STATUS = {
  trial_active: { label: 'Trial active', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  active: { label: 'Active', cls: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30' },
  lapsed: { label: 'Lapsed', cls: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30' },
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BillingCard({ account, onManage, busy }) {
  const plan = PLANS.find((p) => p.id === account.plan) || PLANS[0];
  const billing = account.billing === 'annual' ? 'annual' : 'monthly';
  const status = STATUS[account.subscription_status] || STATUS.trial_active;
  const limit = planLimit(account.plan);
  const used = account.operative_count || 0;
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const nearLimit = limit && used >= limit * 0.8;
  const isTrial = account.subscription_status === 'trial_active';

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
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" /> Operatives tracked
            </span>
            <span className="font-semibold text-foreground">
              {used}{limit ? ` of ${limit}` : ''}
            </span>
          </div>
          {limit > 0 && (
            <>
              <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${nearLimit ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {used >= limit
                  ? "You've reached your plan limit — upgrade to add more operatives."
                  : `${limit - used} more operative${limit - used === 1 ? '' : 's'} available on this plan.`}
              </p>
            </>
          )}
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
          {isTrial && account.trial_ends_at && (
            <div className="flex items-start justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="w-4 h-4" /> First payment
              </span>
              <span className="font-semibold text-foreground text-right">
                {fmtDate(account.trial_ends_at)}
              </span>
            </div>
          )}
          {isTrial && (
            <p className="text-xs text-muted-foreground">
              Your free trial runs until then. You won't be charged before that date, and your subscription
              starts automatically afterwards unless you cancel.
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
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold h-11"
            onClick={onManage}
            disabled={busy}
          >
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowUpRight className="w-4 h-4 mr-2" />}
            Manage subscription &amp; billing
          </Button>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Change plan (Crew, Contractor or Firm)</li>
            <li>• Switch between monthly and annual billing</li>
            <li>• Update your card or billing address</li>
            <li>• Download invoices and receipts</li>
            <li>• Cancel your subscription</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Plan changes take effect straight away and any price difference is worked out for you automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}