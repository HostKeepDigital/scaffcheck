import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DocTypePicker from '@/components/DocTypePicker';
import { Loader2, Upload, Sparkles, FileText, Check } from 'lucide-react';
import { classifyVerdict } from '@/lib/docVerdict';
import DocVerdictNotice from '@/components/DocVerdictNotice';

export default function DocumentForm({ open, onClose, operativeId, accountId, onSaved, onCreate }) {
  const [docType, setDocType] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [fileName, setFileName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [aiIssue, setAiIssue] = useState(false);
  const [aiExpiry, setAiExpiry] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [overrideConfirmed, setOverrideConfirmed] = useState(false);

  const resetForm = () => {
    setDocType(''); setFileUri(''); setFileName(''); setIssueDate(''); setExpiryDate('');
    setAiIssue(false); setAiExpiry(false); setError('');
    setVerdict(null); setOverrideConfirmed(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    setFileUri(''); setFileName(''); setIssueDate(''); setExpiryDate('');
    setAiIssue(false); setAiExpiry(false);
    setVerdict(null); setOverrideConfirmed(false);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      setFileUri(file_uri);
      setFileName(file.name);
      setExtracting(true);
      let result = null;
      try {
        const response = await base44.functions.invoke('extractDocumentDates', { file_uri, expected_type: docType || undefined });
        result = response.data;
      } catch (analysisError) {
        console.error('Document analysis failed:', analysisError);
      }
      if (result?.issue_date) { setIssueDate(result.issue_date); setAiIssue(true); }
      if (result?.expiry_date) { setExpiryDate(result.expiry_date); setAiExpiry(true); }
      setVerdict(classifyVerdict(result, docType));
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setExtracting(false);
    }
  };

  const handleDateEdit = (field) => {
    if (field === 'issue') setAiIssue(false);
    if (field === 'expiry') setAiExpiry(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!docType) { setError('Please select a document type'); return; }
    if (!fileUri) { setError('Please upload a file'); return; }
    if (!expiryDate) { setError('Expiry date is required'); return; }
    if (verdict?.outcome === 'block') { setError(verdict.message); return; }
    if (verdict?.outcome === 'warn' && !overrideConfirmed) {
      setError('Please confirm this is the right document before saving.');
      return;
    }
    setSaving(true);
    try {
      const docData = {
        account_id: accountId,
        operative_id: operativeId,
        document_type: docType,
        file_uri: fileUri,
        issue_date: issueDate || null,
        expiry_date: expiryDate,
        uploaded_at: new Date().toISOString(),
      };
      if (onCreate) {
        await onCreate(docData);
      } else {
        await base44.entities.ComplianceDocument.create(docData);
      }
      onSaved?.();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Compliance Document</DialogTitle>
        </DialogHeader>
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Document type *</Label>
            <DocTypePicker value={docType} onChange={setDocType} />
          </div>

          <div className="space-y-1.5">
            <Label>Document file *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              {uploading || extracting ? (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploading ? 'Uploading…' : 'Checking document…'}
                </div>
              ) : fileUri ? (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" /> <span className="truncate max-w-[200px]">{fileName}</span>
                  <Button type="button" variant="ghost" size="sm" className="ml-2 text-xs" onClick={() => { setFileUri(''); setFileName(''); }}>
                    Change
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6 text-muted-foreground/70" />
                  <span className="text-sm text-muted-foreground">Click to upload</span>
                  <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <DocVerdictNotice verdict={verdict} confirmed={overrideConfirmed} onConfirmChange={setOverrideConfirmed} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                Issue date
                {aiIssue && <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium"><Sparkles className="w-3 h-3" /> AI</span>}
              </Label>
              <Input
                type="date" value={issueDate}
                onChange={(e) => { setIssueDate(e.target.value); handleDateEdit('issue'); }}
                className={aiIssue ? 'border-amber-500 ring-1 ring-amber-500' : ''}
              />
              {aiIssue && <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5"><Sparkles className="w-3 h-3" /> Suggested by AI — please confirm</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                Expiry date *
                {aiExpiry && <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium"><Sparkles className="w-3 h-3" /> AI</span>}
              </Label>
              <Input
                type="date" value={expiryDate}
                onChange={(e) => { setExpiryDate(e.target.value); handleDateEdit('expiry'); }}
                className={aiExpiry ? 'border-amber-500 ring-1 ring-amber-500' : ''}
              />
              {aiExpiry && <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5"><Sparkles className="w-3 h-3" /> Suggested by AI — please confirm</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving || uploading || extracting || verdict?.outcome === 'block' || (verdict?.outcome === 'warn' && !overrideConfirmed)}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save document'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}