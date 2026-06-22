import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function Dashboard() {
  const { account } = useAccount();
  const navigate = useNavigate();
  const [operatives, setOperatives] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reporting, setReporting] = useState(false);

  const loadData = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    try {
      const [ops, docs] = await Promise.all([
        base44.entities.Operative.filter({ account_id: account.id }),
        base44.entities.ComplianceDocument.filter({ account_id: account.id }),
      ]);
      setOperatives(ops || []);
      setDocuments(docs || []);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => { loadData(); }, [loadData]);

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
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Operatives</h1>
            <p className="text-sm text-slate-500">{account?.company_name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReport} disabled={reporting || operatives.length === 0}>
              {reporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
              Compliance Report
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-[#0F172A] hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" /> Add Operative
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : operatives.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-4">No operatives yet. Add your first one to get started.</p>
            <Button onClick={() => setShowForm(true)} className="bg-[#0F172A] hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" /> Add Operative
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <SummaryBar operatives={operatives} documentsByOperative={docsByOperative} />
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {operativesWithRag.map((op) => (
                    <tr key={op.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/operative/${op.id}`)}>
                      <td className="px-4 py-3 font-medium text-[#0F172A]">{op.full_name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{op.company_name || '—'}</td>
                      <td className="px-4 py-3"><RAGBadge rag={op.rag} /></td>
                      <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-slate-400" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {operativesWithRag.map((op) => (
                <div key={op.id} className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer active:bg-slate-50"
                  onClick={() => navigate(`/operative/${op.id}`)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#0F172A]">{op.full_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{op.company_name || 'No company'}</p>
                    </div>
                    <RAGBadge rag={op.rag} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <OperativeForm open={showForm} onClose={() => setShowForm(false)} accountId={account?.id} onSaved={loadData} />
    </div>
  );
}