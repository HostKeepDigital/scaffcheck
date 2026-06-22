import { RAG_META } from '@/lib/compliance';

export default function RAGBadge({ rag, showLabel = false }) {
  const meta = RAG_META[rag];
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap"
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      {rag}
      {showLabel && <span className="ml-1.5 normal-case font-medium opacity-90">{meta.label}</span>}
    </span>
  );
}