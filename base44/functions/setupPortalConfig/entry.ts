import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@18.3.0';
import { stripeSecretKey, priceId } from '../../shared/stripeMode.ts';

// One-off admin utility: creates a Stripe Customer Portal configuration that
// resets the billing cycle anchor on plan change, so monthly -> annual is a
// single prorated charge instead of a prorated term plus the next year.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const stripe = new Stripe(stripeSecretKey());

    // Group our plan prices by their Stripe product
    const byProduct: Record<string, string[]> = {};
    for (const plan of ['crew', 'contractor', 'firm']) {
      for (const billing of ['monthly', 'annual']) {
        const id = priceId(plan, billing);
        if (!id) continue;
        const price = await stripe.prices.retrieve(id);
        const product = typeof price.product === 'string' ? price.product : price.product.id;
        (byProduct[product] ||= []).push(id);
      }
    }

    const products = Object.entries(byProduct).map(([product, prices]) => ({ product, prices }));

    const config = await stripe.billingPortal.configurations.create({
      business_profile: { headline: 'ScaffKeep subscription' },
      features: {
        customer_update: { enabled: true, allowed_updates: ['email', 'address', 'name', 'tax_id'] },
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        subscription_cancel: { enabled: true, mode: 'at_period_end' },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price'],
          proration_behavior: 'create_prorations',
          billing_cycle_anchor: 'now',
          // Defer downgrades (cheaper price, or annual -> monthly) to period end
          schedule_at_period_end: {
            conditions: [
              { type: 'decreasing_item_amount' },
              { type: 'shortening_interval' },
            ],
          },
          products,
        },
      },
    });

    return Response.json({ configuration_id: config.id, products });
  } catch (error) {
    console.error('setupPortalConfig error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}