import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@18.3.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { plan, company_name, user_id } = await req.json();

    if (!user_id) return Response.json({ error: 'Missing user_id' }, { status: 400 });

    const priceMap = {
      founding: 'price_1Tl6ZJG98uz9Nro6zXvcC47U',
      standard: 'price_1Tl6ZJG98uz9Nro6MXSmSGuL',
    };
    const priceId = priceMap[plan];
    if (!priceId) return Response.json({ error: 'Invalid plan' }, { status: 400 });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    // Check for existing account/customer
    const existing = await base44.asServiceRole.entities.Account.filter({ owner_user_id: user_id });
    const existingAccount = existing && existing.length > 0 ? existing[0] : null;
    const customerId = existingAccount?.stripe_customer_id;

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          user_id,
          company_name: company_name || '',
          plan,
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
        },
      },
      metadata: {
        user_id,
        company_name: company_name || '',
        plan,
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