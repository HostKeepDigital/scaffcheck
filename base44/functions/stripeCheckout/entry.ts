import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@18.3.0';
import { stripeSecretKey, priceId } from '../../shared/stripeMode.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { plan, billing, company_name } = await req.json();
    const user_id = user.id;

    const billingPeriod = billing === 'annual' ? 'annual' : 'monthly';
    const price = priceId(plan, billingPeriod);
    if (!price) return Response.json({ error: 'Invalid plan' }, { status: 400 });

    const stripe = new Stripe(stripeSecretKey());
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    // Check for existing account/customer
    const existing = await base44.asServiceRole.entities.Account.filter({ owner_user_id: user_id });
    const existingAccount = existing && existing.length > 0 ? existing[0] : null;
    const customerId = existingAccount?.stripe_customer_id;
    const hasUsedTrial = !!existingAccount?.has_used_trial;

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      subscription_data: {
        ...(hasUsedTrial ? {} : { trial_period_days: 7 }),
        metadata: {
          user_id,
          company_name: company_name || '',
          plan,
          billing: billingPeriod,
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
        },
      },
      metadata: {
        user_id,
        company_name: company_name || '',
        plan,
        billing: billingPeriod,
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
      },
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/settings?checkout=cancelled`,
    };

    if (customerId) sessionParams.customer = customerId;

    const session = await stripe.checkout.sessions.create(sessionParams);

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});