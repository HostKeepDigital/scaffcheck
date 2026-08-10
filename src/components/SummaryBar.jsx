import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { getOperativeCompliance } from '@/lib/compliance';

export default function SummaryBar({ operatives, documentsByOperative, activeFilter = null, onFilterChange }) {
  let green = 0, amber = 0, red = 0;
  for (const op of operatives) {
    const docs = documentsByOperative[op.id] || [];
    const { rag } = getOperativeCompliance(docs);
    if (rag === 'green') green++;
    else if (rag === 'amber') amber++;
    else red++;
  }

  const cards = [
    { label: 'Compliant', count: green, bg: '#16A34A', rag: 'green' },
    { label: 'Action needed', count: amber, bg: '#D97706', rag: 'amber' },
    { label: 'Non-compliant', count: red, bg: '#DC2626', rag: 'red' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {cards.map((c) => {
        const active = activeFilter === c.rag;
        return (
          <motion.button
            key={c.rag}
            type="button"
            aria-pressed={active}
            aria-label={active ? `Clear ${c.label} filter` : `Filter by ${c.label}`}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onFilterChange?.(active ? null : c.rag)}
            className={`relative cursor-pointer rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-white shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              active ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
            }`}
            style={{ backgroundColor: c.bg }}
          >
            {active && (
              <span className="absolute top-1.5 right-1.5 opacity-70">
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <span className="text-2xl sm:text-4xl font-bold tabular-nums">{c.count}</span>
            <span className="text-[10px] sm:text-xs font-medium mt-0.5 opacity-90 text-center">{c.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}