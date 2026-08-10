import { PLANS } from '@/lib/stripePrices';

export default function DowngradeLimitNotice({ operativeCount = 0 }) {
  const blocked = PLANS.filter((p) => operativeCount > p.operativeLimit);
  if (blocked.length === 0) return null;

  return (
    <div className="space-y-1 text-xs text-muted-foreground">
      {blocked.map((p) => (
        <p key={p.id}>
          You're tracking {operativeCount} operative{operativeCount === 1 ? '' : 's'}. {p.name} covers up to{' '}
          {p.operativeLimit} — you'd need to remove {operativeCount - p.operativeLimit} before switching to that plan.
        </p>
      ))}
    </div>
  );
}