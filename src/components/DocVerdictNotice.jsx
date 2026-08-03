import { AlertTriangle, XCircle } from 'lucide-react';

export default function DocVerdictNotice({ verdict, confirmed, onConfirmChange }) {
  if (!verdict || verdict.outcome === 'clean') return null;

  const isBlock = verdict.outcome === 'block';

  return (
    <div className={`rounded-lg p-3 text-xs space-y-2 ${isBlock ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
      <div className="flex gap-2">
        {isBlock ? <XCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
        <p className="font-medium">{verdict.message}</p>
      </div>
      {verdict.issues?.length > 0 && (
        <ul className="list-disc pl-8 space-y-0.5 opacity-90">
          {verdict.issues.map((issue, i) => <li key={i}>{issue}</li>)}
        </ul>
      )}
      {!isBlock && (
        <label className="flex items-center gap-2 pl-6 cursor-pointer font-medium">
          <input type="checkbox" checked={!!confirmed} onChange={(e) => onConfirmChange(e.target.checked)} className="accent-amber-500" />
          Upload anyway — I've checked this is the right document
        </label>
      )}
    </div>
  );
}