import { getOperativeCompliance } from '@/lib/compliance';

export default function SummaryBar({ operatives, documentsByOperative }) {
  let green = 0, amber = 0, red = 0;
  for (const op of operatives) {
    const docs = documentsByOperative[op.id] || [];
    const { rag } = getOperativeCompliance(docs);
    if (rag === 'green') green++;
    else if (rag === 'amber') amber++;
    else red++;
  }

  const cards = [
    { label: 'Compliant', count: green, bg: '#16A34A', rag: 'GREEN' },
    { label: 'Action needed', count: amber, bg: '#D97706', rag: 'AMBER' },
    { label: 'Non-compliant', count: red, bg: '#DC2626', rag: 'RED' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {cards.map((c) => (
        <div
          key={c.rag}
          className="rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-white"
          style={{ backgroundColor: c.bg }}
        >
          <span className="text-2xl sm:text-4xl font-bold tabular-nums">{c.count}</span>
          <span className="text-[10px] sm:text-xs font-medium mt-0.5 opacity-90 text-center">{c.label}</span>
        </div>
      ))}
    </div>
  );
}