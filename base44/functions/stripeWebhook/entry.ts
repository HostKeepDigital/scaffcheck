import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@18.3.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const companyName = session.metadata?.company_name || 'My Company';
        const plan = session.metadata?.plan;

        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);

        const existing = await base44.asServiceRole.entities.Account.filter({ owner_user_id: userId });
        if (existing && existing.length > 0) {
          await base44.asServiceRole.entities.Account.update(existing[0].id, {
            subscription_status: 'trial_active',
            trial_ends_at: trialEnd.toISOString(),
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan,
          });
        } else {
          await base44.asServiceRole.entities.Account.create({
            company_name: companyName,
            owner_user_id: userId,
            subscription_status: 'trial_active',
            trial_ends_at: trialEnd.toISOString(),
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan,
            operative_count: 0,
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const accounts = await base44.asServiceRole.entities.Account.filter({
          stripe_customer_id: subscription.customer,
        });
        if (accounts && accounts.length > 0) {
          let status = 'active';
          if (['past_due', 'unpaid', 'canceled', 'incomplete_expired'].includes(subscription.status)) {
            status = 'lapsed';
          } else if (subscription.status === 'trialing') {
            status = 'trial_active';
          }
          await base44.asServiceRole.entities.Account.update(accounts[0].id, {
            subscription_status: status,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const accounts = await base44.asServiceRole.entities.Account.filter({
          stripe_customer_id: subscription.customer,
        });
        if (accounts && accounts.length > 0) {
          await base44.asServiceRole.entities.Account.update(accounts[0].id, {
            subscription_status: 'lapsed',
          });
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});