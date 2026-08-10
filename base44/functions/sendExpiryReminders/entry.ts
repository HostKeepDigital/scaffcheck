import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const REQUIRED_DOC_TYPES = [
  'CISRS Card',
  'Public Liability Insurance',
  'Employers Liability Insurance',
  'RAMS',
];

const REMINDER_THRESHOLDS = [30, 14, 7, 3, 1, 0];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all accounts
    const accounts = await base44.asServiceRole.entities.Account.list();
    if (!accounts || accounts.length === 0) {
      return Response.json({ message: 'No accounts found', sent: 0 });
    }

    let totalSent = 0;

    for (const account of accounts) {
      // Get all operatives for this account
      const operatives = await base44.asServiceRole.entities.Operative.filter({ account_id: account.id });
      if (!operatives || operatives.length === 0) continue;

      // Collect reminders grouped by threshold
      const remindersByThreshold = {};

      for (const operative of operatives) {
        // Get all documents for this operative
        const documents = await base44.asServiceRole.entities.ComplianceDocument.filter({
          operative_id: operative.id,
        });
        if (!documents || documents.length === 0) continue;

        // Find current version per document type
        const currentByType = {};
        for (const doc of documents) {
          const ts = doc.uploaded_at || doc.created_date;
          const existing = currentByType[doc.document_type];
          if (!existing || new Date(ts) > new Date(existing.uploaded_at || existing.created_date)) {
            currentByType[doc.document_type] = doc;
          }
        }

        // Check each required doc type
        for (const docType of REQUIRED_DOC_TYPES) {
          const currentDoc = currentByType[docType];
          if (!currentDoc || !currentDoc.expiry_date) continue;

          const expiry = new Date(currentDoc.expiry_date + 'T00:00:00');
          expiry.setHours(0, 0, 0, 0);
          const diffDays = Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          if (REMINDER_THRESHOLDS.includes(diffDays)) {
            if (!remindersByThreshold[diffDays]) remindersByThreshold[diffDays] = [];
            remindersByThreshold[diffDays].push({
              operative_name: operative.full_name,
              document_type: docType,
              expiry_date: currentDoc.expiry_date,
            });
          }
        }
      }

      // Send one email per threshold per account
      const users = await base44.asServiceRole.entities.User.filter({ id: account.owner_user_id });
      if (!users || users.length === 0) continue;
      const contractorEmail = users[0].email;

      for (const [threshold, items] of Object.entries(remindersByThreshold)) {
        const dayLabel = threshold === '0' ? 'expires TODAY' : `expires in ${threshold} day${threshold === '1' ? '' : 's'}`;
        const subject = `ScaffKeep: ${items.length} document${items.length === 1 ? '' : 's'} ${dayLabel}`;

        const body = items.map(item =>
          `• ${item.operative_name} — ${item.document_type} — expires ${item.expiry_date}`
        ).join('\n');

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: contractorEmail,
          subject,
          body: `The following compliance documents ${dayLabel}:\n\n${body}\n\nPlease log in to ScaffKeep to review and take action if needed.\n\nScaffKeep — a Keep Technologies Ltd product.`,
        });
        totalSent++;
      }
    }

    return Response.json({ success: true, sent: totalSent });
  } catch (error) {
    console.error('Expiry reminders error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});