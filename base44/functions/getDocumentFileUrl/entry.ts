import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { document_id } = await req.json();
    if (!document_id) return Response.json({ error: 'Missing document_id' }, { status: 400 });

    const docs = await base44.asServiceRole.entities.ComplianceDocument.filter({ id: document_id });
    if (!docs || docs.length === 0) return Response.json({ error: 'Document not found' }, { status: 404 });
    const doc = docs[0];

    const accounts = await base44.asServiceRole.entities.Account.filter({ owner_user_id: user.id });
    if (!accounts || accounts.length === 0) return Response.json({ error: 'Forbidden' }, { status: 403 });

    if (doc.account_id !== accounts[0].id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri: doc.file_uri,
      expires_in: 300,
    });

    return Response.json({ signed_url });
  } catch (error) {
    console.error('getDocumentFileUrl error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}