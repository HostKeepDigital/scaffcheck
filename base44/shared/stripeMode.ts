// Single switch for the whole Stripe integration.
// true  = TEST mode (no real money, use card 4242 4242 4242 4242)
// false = LIVE mode (real charges)
export const USE_TEST_MODE = true;

export function stripeSecretKey(): string {
  return USE_TEST_MODE
    ? Deno.env.get('STRIPE_TEST_MODE_SECRET_KEY')!
    : Deno.env.get('STRIPE_SECRET_KEY')!;
}

export function stripeWebhookSecret(): string {
  return USE_TEST_MODE
    ? Deno.env.get('STRIPE_TEST_MODE_WEBHOOK_SECRET')!
    : Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
}

const TEST_PRICES = {
  crew:       { monthly: 'price_1U2uyiBQ50uYJDYFsIViUL83', annual: 'price_1U2uyiBQ50uYJDYF0Kw4hiWE' },
  contractor: { monthly: 'price_1U2uyiBQ50uYJDYF2HrbshSm', annual: 'price_1U2uyjBQ50uYJDYFFpQUSI93' },
  firm:       { monthly: 'price_1U2uyjBQ50uYJDYF9BvfLSzG', annual: 'price_1U2uyjBQ50uYJDYF1KRVsggw' },
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