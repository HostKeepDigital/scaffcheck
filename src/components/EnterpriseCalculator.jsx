import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Mail } from 'lucide-react';
import BillingToggle from '@/components/BillingToggle';
import { bandForCount, PLANS } from '@/lib/stripePrices';
import { enterpriseMailto } from '@/lib/contact';

const parseCount = (raw) => {
  if (!/^\d+$/.test(raw.trim())) return null;
  const n = parseInt(raw, 10);
  return n >= 1 ? n : null;
};

const standardMessage = (n) => {
  const plan = PLANS.find((p) => n <= p.operativeLimit);
  return plan
    ? `Our ${plan.name} plan covers up to ${plan.operativeLimit} operatives — please choose it above.`
    : null;
};

export default function EnterpriseCalculator({
  companyName = '',
  billingPeriod,
  dark = false,
  onSubscribe,
}) {
  const [raw, setRaw] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [internalPeriod, setInternalPeriod] = useState('monthly');
  const timer = useRef(null);

  const period = billingPeriod || internalPeriod;
  const count = parseCount(raw);
  const band = bandForCount(count);

  useEffect(() => {
    setShowMessage(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShowMessage(true), 800);
    return () => clearTimeout(timer.current);
  }, [raw]);

  const reveal = () => {
    if (timer.current) clearTimeout(timer.current);
    setShowMessage(true);
  };

  const isBand = band && band !== 'standard' && band !== 'contact';
  const saving = isBand ? band.monthly * 12 - band.annual : 0;

  const message =
    !showMessage || !count
      ? null
      : band === 'standard'
      ? standardMessage(count)
      : band === 'contact'
      ? "For more than 500 operatives we'll build a custom plan — get in touch."
      : null;

  const handleSubscribe = () => {
    // TODO: wire enterprise bands to Stripe checkout once prices exist.
    if (onSubscribe) onSubscribe(band, period);
  };

  const subText = dark ? 'text-slate-400' : 'text-muted-foreground';

  return (
    <Card className={dark ? 'border-slate-700 bg-slate-800/50 text-white' : 'border-dashed'}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="font-semibold">Need more than 80 operatives?</p>
            <p className={`text-sm ${subText}`}>
              Enter your headcount and we'll show you the right enterprise band instantly.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ent-count">How many operatives do you need to track?</Label>
          <Input
            id="ent-count"
            inputMode="numeric"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={reveal}
            onKeyDown={(e) => e.key === 'Enter' && reveal()}
            placeholder="e.g. 150"
            className={dark ? 'bg-slate-900 border-slate-700 text-white max-w-xs' : 'max-w-xs'}
          />
        </div>

        {!billingPeriod && isBand && (
          <BillingToggle value={internalPeriod} onChange={setInternalPeriod} dark={dark} />
        )}

        {isBand && (
          <div className={`rounded-xl p-4 border ${dark ? 'border-amber-500/40 bg-slate-900' : 'border-amber-500/40 bg-amber-500/5'}`}>
            <p className="font-semibold">{band.name}</p>
            <p className={`text-sm ${subText}`}>Up to {band.max} operatives</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold">£{(period === 'annual' ? band.annual : band.monthly).toLocaleString()}</span>
              <span className={subText}>{period === 'annual' ? '/year' : '/month'}</span>
            </div>
            {period === 'annual' && saving > 0 && (
              <p className="text-xs font-medium text-green-500 mt-1">Save £{saving.toLocaleString()} a year</p>
            )}
            <Button
              className="w-full mt-4 h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              onClick={handleSubscribe}
            >
              Subscribe
            </Button>
          </div>
        )}

        {message && (
          <p className={`text-sm ${subText}`}>
            {message}
            {band === 'contact' && (
              <>
                {' '}
                <a href={enterpriseMailto(companyName)} className="underline font-medium text-amber-500 inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Contact us
                </a>
              </>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}