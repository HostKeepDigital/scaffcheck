// Single switch for the whole Stripe integration.
// true  = TEST mode (no real money, use card 4242 4242 4242 4242)
// false = LIVE mode (real charges)
export const USE_TEST_MODE = true;

export function stripeSecretKey(): string {
  return USE_TEST_MODE
    ? Deno.env.get('STRIPE_TEST_SECRET_KEY')!
    : Deno.env.get('STRIPE_SECRET_KEY')!;
}

export function stripeWebhookSecret(): string {
  return USE_TEST_MODE
    ? Deno.env.get('STRIPE_TEST_MODE_WEBHOOK_SECRET')!
    : Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
}

const TEST_PRICES = {
  crew:       { monthly: 'price_1U2ryEBQ50uYJDYF2oUicmx7', annual: 'price_1U2ryEBQ50uYJDYFHlnI7FeT' },
  contractor: { monthly: 'price_1U2ryEBQ50uYJDYFlx5wf6WS', annual: 'price_1U2ryEBQ50uYJDYF8ge4w2ho' },
  firm:       { monthly: 'price_1U2ryEBQ50uYJDYFafib9LQo', annual: 'price_1U2ryEBQ50uYJDYFtKkAyXAV' },
};

const LIVE_PRICES = {
  crew:       { monthly: 'price_1U2uCrJJqUTDO3orWHT0F9O1', annual: 'price_1U2uCsJJqUTDO3orVoOVLL1o' },
  contractor: { monthly: 'price_1U2uCsJJqUTDO3orAihO2oA4', annual: 'price_1U2uCsJJqUTDO3orACmfE3vr' },
  firm:       { monthly: 'price_1U2uCsJJqUTDO3orK4U2eA3C', annual: 'price_1U2uCsJJqUTDO3orGk5wyrmI' },
};

export function priceId(plan: string, billing: string): string | undefined {
  const prices = USE_TEST_MODE ? TEST_PRICES : LIVE_PRICES;
  return prices[plan]?.[billing === 'annual' ? 'annual' : 'monthly'];
}

// Reverse lookup: which plan/billing does a Stripe price belong to?
export function planFromPriceId(id: string): { plan: string; billing: string } | undefined {
  for (const prices of [TEST_PRICES, LIVE_PRICES]) {
    for (const [plan, cycles] of Object.entries(prices)) {
      if (cycles.monthly === id) return { plan, billing: 'monthly' };
      if (cycles.annual === id) return { plan, billing: 'annual' };
    }
  }
  return undefined;
}