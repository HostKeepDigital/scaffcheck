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

export function annualSaving(plan) {
  const monthlyForYear = plan.monthly.price * 12;
  const saving = monthlyForYear - plan.annual.price;
  return saving > 0 ? saving : 0;
}

export const TRIAL_DAYS = 7;