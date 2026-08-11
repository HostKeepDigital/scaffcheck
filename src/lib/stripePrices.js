export const STRIPE_PRICES = {
  crew:       { monthly: 'price_1U2ryEBQ50uYJDYF2oUicmx7', annual: 'price_1U2ryEBQ50uYJDYFHlnI7FeT' },
  contractor: { monthly: 'price_1U2ryEBQ50uYJDYFlx5wf6WS', annual: 'price_1U2ryEBQ50uYJDYF8ge4w2ho' },
  firm:       { monthly: 'price_1U2ryEBQ50uYJDYFafib9LQo', annual: 'price_1U2ryEBQ50uYJDYFtKkAyXAV' },
};

export const PLANS = [
  {
    id: 'crew', name: 'Crew', operativeLimit: 15,
    monthly: { price: 59, priceLabel: '£59' },
    annual:  { price: 590, priceLabel: '£590' },
    description: 'Up to 15 operatives — full access to all ScaffKeep features.',
    highlight: false, badge: null,
  },
  {
    id: 'contractor', name: 'Contractor', operativeLimit: 40,
    monthly: { price: 99, priceLabel: '£99' },
    annual:  { price: 990, priceLabel: '£990' },
    description: 'Up to 40 operatives — full access to all ScaffKeep features.',
    highlight: true, badge: 'Most popular',
  },
  {
    id: 'firm', name: 'Firm', operativeLimit: 80,
    monthly: { price: 149, priceLabel: '£149' },
    annual:  { price: 1490, priceLabel: '£1,490' },
    description: 'Up to 80 operatives — full access to all ScaffKeep features.',
    highlight: false, badge: null,
  },
];

export function planLimit(planId) {
  return PLANS.find((p) => p.id === planId)?.operativeLimit ?? null;
}

export function annualSaving(plan) {
  const monthlyForYear = plan.monthly.price * 12;
  const saving = monthlyForYear - plan.annual.price;
  return saving > 0 ? saving : 0;
}

export const ENTERPRISE_BANDS = [
  { id: 'ent1', name: 'Enterprise 1', max: 120, monthly: 199, annual: 1990 },
  { id: 'ent2', name: 'Enterprise 2', max: 175, monthly: 269, annual: 2690 },
  { id: 'ent3', name: 'Enterprise 3', max: 250, monthly: 349, annual: 3490 },
  { id: 'ent4', name: 'Enterprise 4', max: 350, monthly: 449, annual: 4490 },
  { id: 'ent5', name: 'Enterprise 5', max: 500, monthly: 579, annual: 5790 },
];

export function bandForCount(n) {
  if (!n || n < 1) return null;
  if (n > 500) return 'contact';
  if (n <= 80) return 'standard';
  return ENTERPRISE_BANDS.find((b) => n <= b.max) || 'contact';
}

export const TRIAL_DAYS = 7;