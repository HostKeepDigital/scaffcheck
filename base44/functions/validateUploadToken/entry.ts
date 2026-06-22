import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { token } = await req.json();

    if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });

    const invites = await base44.asServiceRole.entities.UploadInvite.filter({
      token,
      is_active: true,
    });

    if (!invites || invites.length === 0) {
      return Response.json({ valid: false, reason: 'not_found' });
    }

    const invite = invites[0];
    const now = new Date();
    const expires = new Date(invite.expires_at);

    if (now > expires) {
      return Response.json({ valid: false, reason: 'expired' });
    }

    const operatives = await base44.asServiceRole.entities.Operative.filter({ id: invite.operative_id });
    if (!operatives || operatives.length === 0) {
      return Response.json({ valid: false, reason: 'operative_not_found' });
    }

    const operative = operatives[0];

    return Response.json({
      valid: true,
      operative_id: operative.id,
      operative_name: operative.full_name,
      account_id: invite.account_id,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});