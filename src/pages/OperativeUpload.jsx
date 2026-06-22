import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HardHat, Loader2, Upload, Sparkles, Check, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { REQUIRED_DOC_TYPES } from '@/lib/compliance';

const emptyDoc = { file: null, fileUrl: '', fileName: '', issueDate: '', expiryDate: '', aiIssue: false, aiExpiry: false, uploading: false, extracting: false };

export default function OperativeUpload() {
  const { token } = useParams();
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [reason, setReason] = useState('');
  const [operativeName, setOperativeName] = useState('');
  const [docs, setDocs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const response = await base44.functions.invoke('validateUploadToken', { token });
        const result = response.data;
        if (result.valid) {
          setValid(true);
          setOperativeName(result.operative_name);
          const initial = {};
          for (const t of REQUIRED_DOC_TYPES) initial[t] = { ...emptyDoc };
          setDocs(initial);
        } else {
          setReason(result.reason);
        }
      } catch {
        setReason('error');
      } finally {
        setValidating(false);
      }
    };
    validate();
  }, [token]);

  const updateDoc = (type, updates) => {
    setDocs((prev) => ({ ...prev, [type]: { ...prev[type], ...updates } }));
  };

  const handleFileChange = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateDoc(type, { ...emptyDoc, uploading: true });
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateDoc(type, { fileUrl: file_url, fileName: file.name, uploading: false, extracting: true });
      const response = await base44.functions.invoke('extractDocumentDates', { file_url });
      const result = response.data;
      updateDoc(type, {
        extracting: false,
        issueDate: result?.issue_date || '',
        expiryDate: result?.expiry_date || '',
        aiIssue: !!result?.issue_date,
        aiExpiry: !!result?.expiry_date,
      });
    } catch {
      updateDoc(type, { uploading: false, extracting: false });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const documents = REQUIRED_DOC_TYPES
        .filter((t) => docs[t].fileUrl)
        .map((t) => ({
          document_type: t,
          file_url: docs[t].fileUrl,
          issue_date: docs[t].issueDate || null,
          expiry_date: docs[t].expiryDate || null,
        }));
      if (documents.length === 0) return;
      await base44.functions.invoke('submitOperativeDocuments', { token, documents });
      setSubmitted(true);
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
          <p className="mt-3 text-sm text-slate-400">Verifying your link...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold mb-2">Link invalid</h1>
          <p className="text-sm text-slate-400">
            {reason === 'expired' ? 'This upload link has expired. Please ask your contractor to send a new one.'
              : 'This upload link is not valid. Please contact your contractor.'}
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Documents submitted</h1>
          <p className="text-sm text-slate-400">Thank you, {operativeName}. Your documents have been sent to your contractor for review.</p>
        </div>
      </div>
    );
  }

  const hasAnyFile = Object.values(docs).some((d) => d.fileUrl);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <HardHat className="w-5 h-5 text-amber-400" />
          <span className="font-bold">ScaffCheck</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-1">Upload your documents</h1>
        <p className="text-sm text-muted-foreground mb-6">Hi {operativeName}, upload your compliance documents below. Take a clear photo of each document.</p>

        <div className="space-y-4">
          {REQUIRED_DOC_TYPES.map((type) => {
            const d = docs[type] || emptyDoc;
            return (
              <div key={type} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-medium text-sm">{type}</span>
                </div>

                {!d.fileUrl ? (
                  <label className="block">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-amber-500 transition">
                      {d.uploading || d.extracting ? (
                        <div className="flex flex-col items-center gap-1">
                          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                          <span className="text-xs text-muted-foreground">{d.uploading ? 'Uploading...' : 'Reading document...'}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-muted-foreground/70" />
                          <span className="text-xs text-muted-foreground">Tap to upload</span>
                        </div>
                      )}
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(type, e)} disabled={d.uploading || d.extracting} />
                  </label>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="truncate flex-1">{d.fileName}</span>
                      <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => updateDoc(type, { ...emptyDoc })}>Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground flex items-center gap-0.5">
                          Issue date {d.aiIssue && <Sparkles className="w-3 h-3 text-amber-400" />}
                        </Label>
                        <Input type="date" value={d.issueDate} onChange={(e) => updateDoc(type, { issueDate: e.target.value, aiIssue: false })}
                          className="bg-input border-input text-foreground text-sm h-9 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground flex items-center gap-0.5">
                          Expiry date {d.aiExpiry && <Sparkles className="w-3 h-3 text-amber-400" />}
                        </Label>
                        <Input type="date" value={d.expiryDate} onChange={(e) => updateDoc(type, { expiryDate: e.target.value, aiExpiry: false })}
                          className="bg-input border-input text-foreground text-sm h-9 mt-1" />
                      </div>
                    </div>
                    {(d.aiIssue || d.aiExpiry) && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5"><Sparkles className="w-3 h-3" /> Suggested by AI — please confirm</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold h-12"
          onClick={handleSubmit} disabled={!hasAnyFile || submitting}>
          {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit documents'}
        </Button>
        {!hasAnyFile && <p className="text-center text-xs text-muted-foreground mt-2">Upload at least one document to submit</p>}
      </div>
    </div>
  );
}