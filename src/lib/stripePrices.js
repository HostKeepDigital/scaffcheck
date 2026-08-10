export const STRIPE_PRICES = {
  crew:       { monthly: 'price_1U12OmBz3dL1znKQ6FAgcgtz', annual: 'price_1U12OmBz3dL1znKQ903TFoxT' },
  contractor: { monthly: 'price_1U12gZBz3dL1znKQTiK3Apvr', annual: 'price_1U12gsBz3dL1znKQimCQMrcQ' },
  firm:       { monthly: 'price_1U12hlBz3dL1znKQbSWtKaqP', annual: 'price_1U12iDBz3dL1znKQLVFTGrnC' },
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

export const TRIAL_DAYS = 7;