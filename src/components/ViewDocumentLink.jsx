import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function ViewDocumentLink({ documentId, showIcon = true, label = 'View' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getDocumentFileUrl', { document_id: documentId });
      window.open(res.data.signed_url, '_blank');
    } catch {
      setError("Couldn't open file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleOpen}
        disabled={loading}
        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : showIcon && <ExternalLink className="w-3 h-3" />}
        {loading ? 'Opening...' : label}
      </button>
      {error && <span className="text-destructive">{error}</span>}
    </span>
  );
}