import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { token, documents } = await req.json();

    if (!token || !documents || !Array.isArray(documents)) {
      return Response.json({ error: 'Missing token or documents' }, { status: 400 });
    }

    // Validate token
    const invites = await base44.asServiceRole.entities.UploadInvite.filter({
      token,
      is_active: true,
    });
    if (!invites || invites.length === 0) {
      return Response.json({ error: 'Invalid or expired invite link' }, { status: 403 });
    }
    const invite = invites[0];
    if (new Date() > new Date(invite.expires_at)) {
      return Response.json({ error: 'This invite link has expired' }, { status: 403 });
    }

    // Get operative
    const operatives = await base44.asServiceRole.entities.Operative.filter({ id: invite.operative_id });
    if (!operatives || operatives.length === 0) {
      return Response.json({ error: 'Operative not found' }, { status: 404 });
    }
    const operative = operatives[0];

    // Create compliance document records
    const uploadedTypes = [];
    for (const doc of documents) {
      if (!doc.document_type || !doc.file_url) continue;
      await base44.asServiceRole.entities.ComplianceDocument.create({
        account_id: invite.account_id,
        operative_id: invite.operative_id,
        document_type: doc.document_type,
        file_url: doc.file_url,
        issue_date: doc.issue_date || null,
        expiry_date: doc.expiry_date || null,
        uploaded_at: new Date().toISOString(),
      });
      uploadedTypes.push(doc.document_type);
    }

    // Notify contractor
    const accounts = await base44.asServiceRole.entities.Account.filter({ id: invite.account_id });
    if (accounts && accounts.length > 0) {
      const account = accounts[0];
      const users = await base44.asServiceRole.entities.User.filter({ id: account.owner_user_id });
      if (users && users.length > 0) {
        const contractorEmail = users[0].email;
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: contractorEmail,
          subject: `ScaffKeep: ${operative.full_name} has submitted documents`,
          body: `Operative ${operative.full_name} has uploaded the following compliance documents via their secure link:\n\n${uploadedTypes.map(t => `• ${t}`).join('\n')}\n\nPlease review them in ScaffKeep.\n\nScaffKeep — a Keep Technologies Ltd product.`,
        });
      }
    }

    return Response.json({ success: true, uploaded_count: uploadedTypes.length });
  } catch (error) {
    console.error('Submit operative documents error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});