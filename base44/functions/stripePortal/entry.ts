import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@18.3.0';
import { stripeSecretKey } from '../../shared/stripeMode.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const accounts = await base44.asServiceRole.entities.Account.filter({ owner_user_id: user.id });
    if (!accounts || accounts.length === 0) {
      return Response.json({ error: 'No account found' }, { status: 404 });
    }
    const account = accounts[0];
    if (!account.stripe_customer_id) {
      return Response.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const stripe = new Stripe(stripeSecretKey());
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    let body = {};
    try { body = await req.json(); } catch (_e) { body = {}; }

    const params = {
      customer: account.stripe_customer_id,
      return_url: `${origin}/settings`,
    };

    // Trial customers get the immediate config (downgrades apply now, so their operative
    // limit drops at the point of change); paying customers get the deferred config
    // (downgrades scheduled to period end). Fall back to the deferred config if the trial
    // one isn't set, and to Stripe's default if neither is.
    const deferredConfigId = Deno.env.get('STRIPE_PORTAL_CONFIG_ID');
    const trialConfigId = Deno.env.get('STRIPE_PORTAL_CONFIG_ID_TRIAL');
    const isTrial = account.subscription_status === 'trial_active';
    const configId = (isTrial && trialConfigId) ? trialConfigId : deferredConfigId;
    if (configId) params.configuration = configId;

    // Deep-link straight to the "change plan" screen when requested
    if (body?.flow === 'change_plan' && account.stripe_subscription_id) {
      params.flow_data = {
        type: 'subscription_update',
        subscription_update: { subscription: account.stripe_subscription_id },
        after_completion: { type: 'redirect', redirect: { return_url: `${origin}/settings` } },
      };
    }

    const session = await stripe.billingPortal.sessions.create(params);

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});