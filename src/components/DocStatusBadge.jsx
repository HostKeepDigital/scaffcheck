import { DOC_STATUS_META } from '@/lib/compliance';

export default function DocStatusBadge({ status }) {
  const meta = DOC_STATUS_META[status];
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      {meta.label}
    </span>
  );
}