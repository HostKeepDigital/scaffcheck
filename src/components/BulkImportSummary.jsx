import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const FIELD_LABELS = {
  full_name: 'Name',
  company_name: 'Company',
  email: 'Email',
  phone: 'Phone',
  role: 'Role',
  notes: 'Notes',
};

export default function BulkImportSummary({ result, remaining }) {
  const { operatives, errors, unmapped, mappedFields = [] } = result;
  const overflow = remaining !== null && operatives.length > remaining;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2 text-foreground">
        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
        <span><strong>{operatives.length}</strong> operative{operatives.length === 1 ? '' : 's'} ready to import.</span>
      </div>

      {mappedFields.length > 0 && (
        <div className="flex items-start gap-2 text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Columns matched: {mappedFields.map((f) => FIELD_LABELS[f] || f).join(', ')}
            {unmapped.length > 0 && ` · Ignored: ${unmapped.join(', ')}`}
          </span>
        </div>
      )}

      {overflow && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Your plan has room for {remaining} more operative{remaining === 1 ? '' : 's'}. Only the first {remaining} row{remaining === 1 ? '' : 's'} will be imported — upgrade your plan to add the rest.</span>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-3 rounded-lg bg-muted border border-border max-h-40 overflow-y-auto">
          <p className="font-medium mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> {errors.length} row issue{errors.length === 1 ? '' : 's'}</p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {errors.map((e, i) => <li key={i}>Row {e.row}: {e.message}</li>)}
          </ul>
        </div>
      )}

      {operatives.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Company</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Role</th>
              </tr>
            </thead>
            <tbody>
              {operatives.slice(0, 5).map((o, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{o.full_name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{o.company_name || '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">{o.role || 'Scaffolder'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {operatives.length > 5 && (
            <p className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">+ {operatives.length - 5} more</p>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Imported operatives start with no documents, so they'll show as red until their CISRS card, insurances and RAMS are uploaded.
      </p>
    </div>
  );
}