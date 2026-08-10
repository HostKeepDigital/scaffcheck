import { Users } from 'lucide-react';

const SEGMENTS = [
  { key: 'green', label: 'Compliant', bar: 'bg-green-500', dot: 'bg-green-500' },
  { key: 'amber', label: 'Expiring soon', bar: 'bg-amber-500', dot: 'bg-amber-500' },
  { key: 'red', label: 'Action required', bar: 'bg-red-500', dot: 'bg-red-500' },
];

export default function OperativeUsageBar({ limit, ragCounts }) {
  const counts = { green: 0, amber: 0, red: 0, ...(ragCounts || {}) };
  const used = counts.green + counts.amber + counts.red;
  const denominator = limit ? Math.max(limit, used) : used || 1;
  const free = limit ? Math.max(limit - used, 0) : 0;
  const over = limit ? Math.max(used - limit, 0) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" /> Operatives
        </span>
        <span className="font-semibold text-foreground">
          {used}{limit ? ` of ${limit}` : ''}
        </span>
      </div>

      <div className="mt-2 flex h-3 w-full rounded-full bg-muted overflow-hidden">
        {SEGMENTS.map(({ key, bar, label }) =>
          counts[key] > 0 ? (
            <div
              key={key}
              className={bar}
              style={{ width: `${(counts[key] / denominator) * 100}%` }}
              title={`${counts[key]} ${label}`}
            />
          ) : null
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {SEGMENTS.map(({ key, label, dot }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">{counts[key]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-muted border border-border" />
          <span className="text-muted-foreground">Slots free</span>
          <span className="font-semibold text-foreground">{limit ? free : '—'}</span>
        </div>
      </div>

      {over > 0 && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          You are {over} operative{over === 1 ? '' : 's'} over your plan limit. Upgrade your plan or remove
          operatives to add anyone new.
        </p>
      )}
      {over === 0 && limit > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {free === 0
            ? "You've used every slot on this plan — upgrade to add more operatives."
            : `Room for ${free} more operative${free === 1 ? '' : 's'} on this plan.`}
        </p>
      )}
    </div>
  );
}