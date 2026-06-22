import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@18.3.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { user_id } = await req.json();

    if (!user_id) return Response.json({ error: 'Missing user_id' }, { status: 400 });

    const accounts = await base44.asServiceRole.entities.Account.filter({ owner_user_id: user_id });
    if (!accounts || accounts.length === 0) {
      return Response.json({ error: 'No account found' }, { status: 404 });
    }
    const account = accounts[0];
    if (!account.stripe_customer_id) {
      return Response.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    const session = await stripe.billingPortal.sessions.create({
      customer: account.stripe_customer_id,
      return_url: `${origin}/settings`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});