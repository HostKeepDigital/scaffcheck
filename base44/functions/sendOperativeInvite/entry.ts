import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { operative_email, operative_name, upload_url } = await req.json();
    if (!operative_email || !operative_name || !upload_url) {
      return Response.json({ error: 'operative_email, operative_name and upload_url are required' }, { status: 400 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secrets.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ScaffKeep <notifications@send.scaffkeep.co.uk>',
        reply_to: 'support@keepsuitetechnologies.co.uk',
        to: operative_email,
        subject: '[ScaffKeep] Upload your compliance documents',
        text: `Hi ${operative_name},\n\nPlease upload your compliance documents (CISRS card, insurance, RAMS) using this secure link:\n\n${upload_url}\n\nThe link is valid for 30 days. You can upload from your phone.\n\nScaffKeep\n\nScaffKeep — a Keepsuite Technologies Ltd product.`,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Resend error:', res.status, errorBody);
      return Response.json({ error: errorBody }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('sendOperativeInvite error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}