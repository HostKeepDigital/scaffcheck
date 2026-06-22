import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAccount } from '@/lib/AccountContext';
import AppHeader from '@/components/AppHeader';
import SummaryBar from '@/components/SummaryBar';
import RAGBadge from '@/components/RAGBadge';
import OperativeForm from '@/components/OperativeForm';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, Loader2, ChevronRight } from 'lucide-react';
import { getOperativeCompliance } from '@/lib/compliance';
import { generateComplianceReport } from '@/lib/pdfReport';
import PullToRefresh from '@/components/PullToRefresh';

export default function Dashboard() {
  const { account } = useAccount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [reporting, setReporting] = useState(false);

  const { data, isLoading: loading, refetch } = useQuery({
    queryKey: ['dashboard', account?.id],
    queryFn: async () => {
      if (!account) return { operatives: [], documents: [] };
      const [ops, docs] = await Promise.all([
        base44.entities.Operative.filter({ account_id: account.id }),
        base44.entities.ComplianceDocument.filter({ account_id: account.id }),
      ]);
      return { operatives: ops || [], documents: docs || [] };
    },
    enabled: !!account,
  });

  const operatives = data?.operatives || [];
  const documents = data?.documents || [];

  const createOperativeMutation = useMutation({
    mutationFn: async (opData) => {
      const op = await base44.entities.Operative.create(opData);
      const ops = await base44.entities.Operative.filter({ account_id: opData.account_id });
      await base44.entities.Account.update(opData.account_id, { operative_count: ops.length });
      return op;
    },
    onMutate: async (opData) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard', account.id] });
      const previous = queryClient.getQueryData(['dashboard', account.id]);
      const tempOp = {
        ...opData,
        id: 'temp-' + Date.now(),
        created_date: new Date().toISOString(),
      };
      queryClient.setQueryData(['dashboard', account.id], (old) => ({
        ...old,
        operatives: [...(old?.operatives || []), tempOp],
      }));
      return { previous };
    },
    onError: (_err, _opData, context) => {
      queryClient.setQueryData(['dashboard', account.id], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', account.id] });
    },
  });

  const loadData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const docsByOperative = {};
  for (const doc of documents) {
    if (!docsByOperative[doc.operative_id]) docsByOperative[doc.operative_id] = [];
    docsByOperative[doc.operative_id].push(doc);
  }

  const operativesWithRag = operatives.map((op) => ({
    ...op,
    rag: getOperativeCompliance(docsByOperative[op.id] || []).rag,
  }));

  const ragOrder = { red: 0, amber: 1, green: 2 };
  operativesWithRag.sort((a, b) => ragOrder[a.rag] - ragOrder[b.rag] || a.full_name.localeCompare(b.full_name));

  const handleReport = () => {
    setReporting(true);
    try {
      generateComplianceReport(account.company_name, operatives, docsByOperative);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <PullToRefresh onRefresh={loadData}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Operatives</h1>
            <p className="text-sm text-muted-foreground">{account?.company_name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReport} disabled={reporting || operatives.length === 0}>
              {reporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
              Compliance Report
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Operative
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/70" />
          </div>
        ) : operatives.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No operatives yet. Add your first one to get started.</p>
            <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Operative
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <SummaryBar operatives={operatives} documentsByOperative={docsByOperative} />
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {operativesWithRag.map((op) => (
                    <tr key={op.id} className="border-b border-border hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/operative/${op.id}`)}>
                      <td className="px-4 py-3 font-medium text-foreground">{op.full_name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{op.company_name || '—'}</td>
                      <td className="px-4 py-3"><RAGBadge rag={op.rag} /></td>
                      <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-muted-foreground/70" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {operativesWithRag.map((op) => (
                <div key={op.id} className="bg-card rounded-xl border border-border p-4 cursor-pointer active:bg-muted/50"
                  onClick={() => navigate(`/operative/${op.id}`)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{op.full_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{op.company_name || 'No company'}</p>
                    </div>
                    <RAGBadge rag={op.rag} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      </PullToRefresh>
      <OperativeForm
        open={showForm}
        onClose={() => setShowForm(false)}
        accountId={account?.id}
        onSaved={loadData}
        onCreate={createOperativeMutation.mutateAsync}
      />
    </div>
  );
}