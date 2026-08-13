import { CheckCircle2, AlertTriangle, Info, Copy } from 'lucide-react';
import BulkImportBlockedNotice from '@/components/BulkImportBlockedNotice';
import BulkImportRow from '@/components/BulkImportRow';

const FIELD_LABELS = {
  full_name: 'Name',
  company_name: 'Company',
  email: 'Email',
  phone: 'Phone',
  role: 'Role',
  notes: 'Notes',
};

export default function BulkImportSummary({
  result, duplicates = [], removedRows, onToggleRemove,
  keptCount, blocked, remaining, planName, limit, currentCount,
}) {
  const { operatives, rowNumbers = [], errors, unmapped, mappedFields = [] } = result;

  const kept = (i) => !removedRows.has(rowNumbers[i]);
  const exactCount = duplicates.filter((d, i) => d.status === 'exact' && kept(i)).length;
  const possibleCount = duplicates.filter((d, i) => d.status === 'possible' && kept(i)).length;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2 text-foreground">
        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
        <span><strong>{keptCount}</strong> operative{keptCount === 1 ? '' : 's'} ready to import.</span>
      </div>

      {mappedFields.length > 0 && (
        <div className="flex items-start gap-2 text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Columns matched: {mappedFields.map((f) => FIELD_LABELS[f] || f).join(', ')}
            {unmapped.length > 0 && ` · Ignored: ${unmapped.join(', ')}`}
          </span>
        </div>
      )}

      {blocked && (
        <BulkImportBlockedNotice
          planName={planName}
          limit={limit}
          currentCount={currentCount}
          fileCount={keptCount}
        />
      )}

      {errors.length > 0 && (
        <div className="p-3 rounded-lg bg-muted border border-border max-h-40 overflow-y-auto">
          <p className="font-medium mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> {errors.length} row issue{errors.length === 1 ? '' : 's'}</p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {errors.map((e, i) => <li key={i}>Row {e.row}: {e.message}</li>)}
          </ul>
        </div>
      )}

      {(exactCount > 0 || possibleCount > 0) && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
          <Copy className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {[
              exactCount > 0 && `${exactCount} duplicate${exactCount === 1 ? '' : 's'}`,
              possibleCount > 0 && `${possibleCount} possible duplicate${possibleCount === 1 ? '' : 's'}`,
            ].filter(Boolean).join(' and ')} found — review before importing. Nothing is removed unless you remove it.
          </span>
        </div>
      )}

      {operatives.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden max-h-72 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Company</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Role</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {operatives.map((o, i) => (
                <BulkImportRow
                  key={rowNumbers[i] ?? i}
                  operative={o}
                  rowNumber={rowNumbers[i] ?? i}
                  dup={duplicates[i]}
                  removed={!kept(i)}
                  onToggleRemove={onToggleRemove}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Imported operatives start with no documents, so they'll show as red until their CISRS card, insurances and RAMS are uploaded.
      </p>
    </div>
  );
}