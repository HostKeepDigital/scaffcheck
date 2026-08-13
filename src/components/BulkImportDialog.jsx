import { useState, useRef, useMemo } from 'react';
import { detectDuplicates } from '@/lib/duplicateCheck';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, Loader2, FileSpreadsheet } from 'lucide-react';
import { csvToOperatives, validateOperatives, CSV_TEMPLATE } from '@/lib/csvParse';
import BulkImportSummary from '@/components/BulkImportSummary';

export default function BulkImportDialog({ open, onClose, accountId, remaining, planName, limit, currentCount, existingOperatives = [], onImported }) {
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [removedRows, setRemovedRows] = useState(new Set());
  const inputRef = useRef(null);

  const reset = () => { setFileName(''); setResult(null); setError(''); setImporting(false); setRemovedRows(new Set()); };

  const duplicates = useMemo(
    () => (result ? detectDuplicates(result.operatives, existingOperatives, result.rowNumbers) : []),
    [result, existingOperatives]
  );

  const validations = useMemo(
    () => (result ? validateOperatives(result.operatives) : []),
    [result]
  );

  const keptOperatives = result
    ? result.operatives.filter(
        (_, i) => !removedRows.has(result.rowNumbers[i]) && !validations[i]?.rejected
      )
    : [];

  const toggleRemove = (rowNumber) => {
    setRemovedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowNumber)) next.delete(rowNumber);
      else next.add(rowNumber);
      return next;
    });
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setFileName(file.name);
    const text = await file.text();
    const parsed = csvToOperatives(text);
    if (parsed.operatives.length === 0 && parsed.errors.length === 0) {
      setError('That file has no data rows.');
      setResult(null);
      return;
    }
    setRemovedRows(new Set());
    setResult(parsed);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scaffkeep-operatives-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (keptOperatives.length === 0) return;
    setImporting(true);
    setError('');
    try {
      const toCreate = keptOperatives
        .map((o) => ({ ...o, account_id: accountId, role: o.role || 'Scaffolder' }));

      await base44.entities.Operative.bulkCreate(toCreate);
      const all = await base44.entities.Operative.filter({ account_id: accountId });
      await base44.entities.Account.update(accountId, { operative_count: all.length });

      await onImported();
      handleClose();
    } catch (err) {
      setError(err.message || 'Import failed');
      setImporting(false);
    }
  };

  // Over the plan limit: block the whole import rather than partially importing
  const blocked = !!result && remaining !== null && keptOperatives.length > remaining;
  const canImport = keptOperatives.length > 0 && !blocked;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import operatives from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV with a row per operative. Column headings are matched automatically — Full Name is required, Company, Email, Phone, Role and Notes are optional.
          </p>

          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" /> Download template
          </Button>

          <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-amber-500/60 transition"
          >
            <FileSpreadsheet className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">{fileName || 'Choose a CSV file'}</p>
            <p className="text-xs text-muted-foreground mt-1">{fileName ? 'Tap to choose a different file' : '.csv up to a few thousand rows'}</p>
          </button>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {result && (
            <BulkImportSummary
              result={result}
              duplicates={duplicates}
              validations={validations}
              removedRows={removedRows}
              onToggleRemove={toggleRemove}
              keptCount={keptOperatives.length}
              blocked={blocked}
              remaining={remaining}
              planName={planName}
              limit={limit}
              currentCount={currentCount}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={importing}>Cancel</Button>
          <Button onClick={handleImport} disabled={!canImport || importing}
            className="bg-primary text-primary-foreground hover:bg-primary/90">
            {importing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</> : <><Upload className="w-4 h-4 mr-2" /> Import operatives</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}