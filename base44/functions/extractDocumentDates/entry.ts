import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { file_url } = await req.json();

    if (!file_url) return Response.json({ error: 'Missing file_url' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a compliance document analyser for UK scaffolding compliance. Examine the uploaded document (image or PDF) and extract:
1. The issue date (if visible on the document)
2. The expiry date / valid until date (if visible on the document)

Return a JSON object with:
- issue_date: "YYYY-MM-DD" format, or null if not found
- expiry_date: "YYYY-MM-DD" format, or null if not found
- confidence: "high", "medium", or "low"

Rules:
- Only extract dates that are clearly visible on the document.
- Do NOT guess or invent dates.
- If the document is a card (e.g. CISRS card), the expiry date is typically the "Valid Until" or "Expiry" date.
- If the document is an insurance certificate, look for the policy expiry/valid-to date.
- If the document is RAMS (Risk Assessment and Method Statement), look for review/expiry dates.
- Return null for any date you cannot find with reasonable confidence.`,
      file_urls: [file_url],
      response_json_schema: {
        type: 'object',
        properties: {
          issue_date: { type: ['string', 'null'] },
          expiry_date: { type: ['string', 'null'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('Date extraction error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});