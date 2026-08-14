import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@18.3.0';
import { stripeSecretKey, stripeWebhookSecret, planFromPriceId } from '../../shared/stripeMode.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const stripe = new Stripe(stripeSecretKey());

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        stripeWebhookSecret()
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
        const billing = session.metadata?.billing || 'monthly';

        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);

        const existing = await base44.asServiceRole.entities.Account.filter({ owner_user_id: userId });
        let accountId;
        if (existing && existing.length > 0) {
          accountId = existing[0].id;
          await base44.asServiceRole.entities.Account.update(accountId, {
            subscription_status: 'trial_active',
            trial_ends_at: trialEnd.toISOString(),
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan,
            billing,
          });
        } else {
          const newAccount = await base44.asServiceRole.entities.Account.create({
            company_name: companyName,
            owner_user_id: userId,
            subscription_status: 'trial_active',
            trial_ends_at: trialEnd.toISOString(),
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan,
            billing,
            operative_count: 0,
          });
          accountId = newAccount.id;
        }
        // Link the user to this account so RLS can scope their data.
        // Service role bypasses FLS on the account_id field.
        await base44.asServiceRole.entities.User.update(userId, { account_id: accountId });
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
          const updates: Record<string, unknown> = { subscription_status: status };
          const item = subscription.items?.data?.[0];
          // Newer Stripe API versions expose the period end on the subscription item
          const periodEnd = item?.current_period_end ?? subscription.current_period_end;
          if (periodEnd) updates.current_period_end = new Date(periodEnd * 1000).toISOString();
          if (subscription.trial_end) {
            updates.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
          }
          const currentPrice = item?.price?.id;
          const matched = currentPrice ? planFromPriceId(currentPrice) : undefined;
          if (matched) {
            updates.plan = matched.plan;
            updates.billing = matched.billing;
          }
          // Scheduled (deferred) plan change — e.g. a downgrade at period end
          updates.pending_plan = null;
          updates.pending_billing = null;
          updates.cancel_at_period_end = !!subscription.cancel_at_period_end;
          updates.cancel_at = subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toISOString()
            : null;
          try {
            if (subscription.schedule) {
              const scheduleId = typeof subscription.schedule === 'string'
                ? subscription.schedule
                : subscription.schedule.id;
              const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
              const futurePhase = (schedule.phases || []).find(
                (p) => periodEnd && p.start_date >= periodEnd
              );
              const futurePrice = futurePhase?.items?.[0]?.price;
              const futurePriceId = typeof futurePrice === 'string' ? futurePrice : futurePrice?.id;
              const futureMatch = futurePriceId ? planFromPriceId(futurePriceId) : undefined;
              if (futureMatch) {
                updates.pending_plan = futureMatch.plan;
                updates.pending_billing = futureMatch.billing;
              }
            }
          } catch (scheduleErr) {
            console.error('Subscription schedule lookup failed:', scheduleErr.message);
          }
          await base44.asServiceRole.entities.Account.update(accounts[0].id, updates);
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