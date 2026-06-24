import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAccount } from '@/lib/AccountContext';
import AppHeader from '@/components/AppHeader';
import RAGBadge from '@/components/RAGBadge';
import DocStatusBadge from '@/components/DocStatusBadge';
import OperativeForm from '@/components/OperativeForm';
import DocumentForm from '@/components/DocumentForm';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, FileDown, Mail, Pencil, Trash2, Loader2, ChevronLeft, History, ExternalLink, Trash } from 'lucide-react';
import { getOperativeCompliance, formatDate, REQUIRED_DOC_TYPES, getCurrentDocuments } from '@/lib/compliance';
import { generateSingleOperativeReport } from '@/lib/pdfReport';

export default function OperativeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useAccount();
  const queryClient = useQueryClient();
  const [showOpForm, setShowOpForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showHistory, setShowHistory] = useState(null);
  const [deleteDocId, setDeleteDocId] = useState(null);
  const [inviting, setInviting] = useState(false);
  const [reporting, setReporting] = useState(false);

  const { data, isLoading: loading, refetch } = useQuery({
    queryKey: ['operative', id],
    queryFn: async () => {
      const [op, docs] = await Promise.all([
        base44.entities.Operative.get(id),
        base44.entities.ComplianceDocument.filter({ operative_id: id }, '-uploaded_at'),
      ]);
      return { operative: op, documents: docs || [] };
    },
    enabled: !!id,
  });

  const operative = data?.operative;
  const documents = data?.documents || [];

  const createDocMutation = useMutation({
    mutationFn: async (docData) => {
      return await base44.entities.ComplianceDocument.create(docData);
    },
    onMutate: async (docData) => {
      await queryClient.cancelQueries({ queryKey: ['operative', id] });
      const previous = queryClient.getQueryData(['operative', id]);
      const tempDoc = {
        ...docData,
        id: 'temp-' + Date.now(),
        created_date: new Date().toISOString(),
      };
      queryClient.setQueryData(['operative', id], (old) => ({
        ...old,
        documents: [...(old?.documents || []), tempDoc],
      }));
      return { previous };
    },
    onError: (_err, _docData, context) => {
      queryClient.setQueryData(['operative', id], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['operative', id] });
    },
  });

  const loadData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const { rag, documentStatuses } = getOperativeCompliance(documents);

  const handleInvite = async () => {
    if (!operative.email) {
      alert('This operative has no email address. Add one to send an invite.');
      return;
    }
    setInviting(true);
    try {
      const token = crypto.randomUUID();
      await base44.entities.UploadInvite.create({
        account_id: account.id,
        operative_id: operative.id,
        token,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      });
      const uploadUrl = `${window.location.origin}/upload/${token}`;
      await base44.integrations.Core.SendEmail({
        to: operative.email,
        subject: 'Upload your compliance documents — ScaffKeep',
        body: `Hi ${operative.full_name},\n\nPlease upload your compliance documents (CISRS card, insurance, RAMS) using this secure link:\n\n${uploadUrl}\n\nThe link is valid for 30 days. You can upload from your phone.\n\nScaffKeep`,
      });
      alert(`Invite sent to ${operative.email}. Link: ${uploadUrl}`);
    } catch (err) {
      alert('Failed to send invite: ' + (err.message || 'Unknown error'));
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await base44.entities.Operative.delete(operative.id);
      const ops = await base44.entities.Operative.filter({ account_id: account.id });
      await base44.entities.Account.update(account.id, { operative_count: ops.length });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete operative: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      await base44.entities.ComplianceDocument.delete(docId);
      setDeleteDocId(null);
      loadData();
    } catch (err) {
      alert('Failed to delete document: ' + (err.message || 'Unknown error'));
    }
  };

  const handleReport = () => {
    setReporting(true);
    try {
      generateSingleOperativeReport(account.company_name, operative, documents);
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground/70" /></div>
      </div>
    );
  }

  if (!operative) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="text-center py-20">
          <p className="text-muted-foreground">Operative not found.</p>
          <Button variant="link" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const docsByType = {};
  for (const doc of documents) {
    if (!docsByType[doc.document_type]) docsByType[doc.document_type] = [];
    docsByType[doc.document_type].push(doc);
  }
  for (const type of Object.keys(docsByType)) {
    docsByType[type].sort((a, b) => new Date(b.uploaded_at || b.created_date) - new Date(a.uploaded_at || a.created_date));
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>

        {/* Operative header */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">{operative.full_name}</h1>
              <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                {operative.company_name && <p>{operative.company_name}</p>}
                <p>{operative.email || 'No email'} · {operative.phone || 'No phone'}</p>
                <p className="text-xs">{operative.role}</p>
                {operative.notes && <p className="text-xs mt-1 text-muted-foreground/70">{operative.notes}</p>}
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <RAGBadge rag={rag} showLabel />
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => setShowOpForm(true)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setShowDelete(true)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button size="sm" onClick={() => setShowDocForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1.5" /> Add Document
          </Button>
          <Button size="sm" variant="outline" onClick={handleInvite} disabled={inviting}>
            {inviting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Mail className="w-4 h-4 mr-1.5" />}
            Invite to Upload
          </Button>
          <Button size="sm" variant="outline" onClick={handleReport} disabled={reporting}>
            {reporting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <FileDown className="w-4 h-4 mr-1.5" />}
            Compliance Report
          </Button>
        </div>

        {/* Documents */}
        <div className="space-y-3">
          {documentStatuses.map((ds) => {
            const versions = docsByType[ds.type] || [];
            const currentDoc = versions[0] || null;
            return (
              <div key={ds.type} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">{ds.type}</span>
                      <DocStatusBadge status={ds.status} />
                    </div>
                    {currentDoc ? (
                      <div className="mt-1.5 text-xs text-muted-foreground flex items-center gap-3">
                        <span>Expires: {formatDate(currentDoc.expiry_date)}</span>
                        {currentDoc.issue_date && <span>Issued: {formatDate(currentDoc.issue_date)}</span>}
                        <a href={currentDoc.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5">
                          <ExternalLink className="w-3 h-3" /> View
                        </a>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground/70">No document uploaded</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {versions.length > 1 && (
                      <Button size="sm" variant="ghost" onClick={() => setShowHistory(showHistory === ds.type ? null : ds.type)}>
                        <History className="w-3.5 h-3.5 mr-1" /> {versions.length}
                      </Button>
                    )}
                  </div>
                </div>

                {showHistory === ds.type && versions.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {versions.map((v, i) => (
                      <div key={v.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded ${i === 0 ? 'bg-green-500/15 text-green-700 dark:text-green-300 font-medium' : 'bg-muted text-muted-foreground'}`}>
                            {i === 0 ? 'Current' : `v${versions.length - i}`}
                          </span>
                          <span className="text-muted-foreground">Expires {formatDate(v.expiry_date)}</span>
                          <a href={v.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">View</a>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-destructive" onClick={() => setDeleteDocId(v.id)}>
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <OperativeForm open={showOpForm} onClose={() => setShowOpForm(false)} operative={operative} onSaved={loadData} />
      <DocumentForm
        open={showDocForm}
        onClose={() => setShowDocForm(false)}
        operativeId={operative.id}
        accountId={account?.id}
        onSaved={loadData}
        onCreate={createDocMutation.mutateAsync}
      />

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete operative?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete {operative.full_name} and all their compliance documents. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteDocId} onOpenChange={(v) => !v && setDeleteDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document version?</AlertDialogTitle>
            <AlertDialogDescription>If this is the current version, the previous version will become current.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteDoc(deleteDocId)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}