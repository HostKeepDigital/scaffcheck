import { X } from 'lucide-react';

const DUP_STYLES = {
  exact: 'bg-yellow-400/25',
  possible: 'bg-amber-400/10',
};

export default function BulkImportRow({ operative, rowNumber, dup, removed, onToggleRemove }) {
  const rowCls = removed
    ? 'opacity-40 line-through'
    : dup?.status
      ? DUP_STYLES[dup.status]
      : '';

  return (
    <tr className={`border-t border-border ${rowCls}`}>
      <td className="px-3 py-2 font-medium align-top">
        {operative.full_name}
        {dup?.status === 'exact' && (
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/25 text-yellow-800 dark:text-yellow-300 whitespace-nowrap">
            Duplicate
          </span>
        )}
        {dup?.status === 'possible' && (
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 whitespace-nowrap">
            Possible duplicate
          </span>
        )}
        {dup?.detail && (
          <p className="mt-0.5 text-[10px] font-normal text-muted-foreground">{dup.detail}</p>
        )}
      </td>
      <td className="px-3 py-2 text-muted-foreground align-top">{operative.company_name || '—'}</td>
      <td className="px-3 py-2 text-muted-foreground align-top">{operative.role || 'Scaffolder'}</td>
      <td className="px-2 py-2 align-top text-right">
        <button
          type="button"
          onClick={() => onToggleRemove(rowNumber)}
          title={removed ? 'Put this row back in the import' : 'Remove this row from the import'}
          className="p-1 rounded hover:bg-muted"
        >
          <X className={`w-4 h-4 ${removed ? 'text-muted-foreground' : 'text-red-600 dark:text-red-400'}`} />
        </button>
      </td>
    </tr>
  );
}