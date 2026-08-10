export default function BillingToggle({ value, onChange, dark = false }) {
  const base = 'px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1.5';
  const activeCls = dark ? 'bg-amber-500 text-white' : 'bg-primary text-primary-foreground';
  const idleCls = dark ? 'text-slate-300 hover:text-white' : 'text-muted-foreground hover:text-foreground';

  return (
    <div className={`inline-flex items-center gap-1 p-1 rounded-full ${dark ? 'bg-slate-800 border border-slate-700' : 'bg-muted'}`}>
      <button type="button" onClick={() => onChange('monthly')}
        className={`${base} ${value === 'monthly' ? activeCls : idleCls}`}>
        Monthly
      </button>
      <button type="button" onClick={() => onChange('annual')}
        className={`${base} ${value === 'annual' ? activeCls : idleCls}`}>
        Annual
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${value === 'annual' ? 'bg-white/20' : dark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>
          2 months free
        </span>
      </button>
    </div>
  );
}