export const STRIPE_PRICES = {
  founding: 'price_1Tl6ZJG98uz9Nro6zXvcC47U',
  standard: 'price_1Tl6ZJG98uz9Nro6MXSmSGuL',
};

export const PLANS = [
  {
    id: 'founding',
    name: 'Founding',
    price: 49,
    priceLabel: '£49',
    period: '/month',
    description: 'Early-adopter rate — full access, permanently lower price.',
    highlight: true,
    badge: 'Early adopter',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 79,
    priceLabel: '£79',
    period: '/month',
    description: 'Full access to all ScaffCheck features.',
    highlight: false,
    badge: null,
  },
];

export const TRIAL_DAYS = 7;