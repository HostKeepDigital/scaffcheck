import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const accounts = await base44.entities.Account.filter({ owner_user_id: user.id });
    if (!accounts || accounts.length === 0) {
      return Response.json({ error: 'No account found' }, { status: 404 });
    }
    const account = accounts[0];

    await base44.entities.ComplianceDocument.deleteMany({ account_id: account.id });
    await base44.entities.UploadInvite.deleteMany({ account_id: account.id });
    await base44.entities.Operative.deleteMany({ account_id: account.id });
    await base44.entities.Account.delete(account.id);
    // Clear the immutable account_id link (service role bypasses FLS).
    await base44.asServiceRole.entities.User.update(user.id, { account_id: null });

    return Response.json({ success: true });
  } catch (error) {
    console.error('deleteAccount error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});