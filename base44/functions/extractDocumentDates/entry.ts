import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const DOC_TYPES = ['CISRS Card', 'Public Liability Insurance', 'Employers Liability Insurance', 'RAMS'];

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { file_uri, expected_type } = await req.json();
    if (!file_uri) return Response.json({ error: 'Missing file_uri' }, { status: 400 });

    const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 300 });

    const expected = DOC_TYPES.includes(expected_type) ? expected_type : null;

    try {
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a compliance document analyser for UK scaffolding compliance. Examine the uploaded document (image or PDF) and classify it, judge its legibility, and extract its key dates.

${expected ? `The uploader submitted this document under the slot: "${expected}". Judge independently what the document actually is, then say whether it matches.` : 'No expected document type was provided.'}

Document type guidance:
- "CISRS Card": a standardised scaffolder record card with CISRS branding, a photo, a registration number, a grade and an expiry date.
- "Public Liability Insurance" and "Employers Liability Insurance": insurance certificates identified by the cover type named on the document plus its indemnity limit and period of insurance. A single combined policy may cover BOTH — if so, note that in issues and set detected_type to whichever cover matches the expected type${expected ? ` ("${expected}")` : ', or the primary cover if no expected type was given'}.
- "RAMS": a bespoke Risk Assessment and Method Statement with no fixed layout — identify it by content (hazards, control measures, method steps, site/date) at moderate confidence. Do NOT judge whether the RAMS is adequate, only that it is a RAMS-type document.
- "Other": anything that is none of the above.

Return a JSON object with:
- detected_type: one of "CISRS Card", "Public Liability Insurance", "Employers Liability Insurance", "RAMS", "Other"
- matches_expected: true/false if an expected type was given above (true only if detected_type equals it exactly), otherwise null
- legible: false if the document is too blurry, blank, cropped or low-quality to read its key details, otherwise true
- confidence: number between 0 and 1 for the classification
- issue_date: the document's issue/start date as "YYYY-MM-DD", or null if not clearly visible
- expiry_date: the document's expiry/valid-until/end date as "YYYY-MM-DD", or null if not clearly visible
- issues: array of short plain-English problem descriptions, e.g. "Looks like a CISRS card but was uploaded under RAMS", "Too blurry to read the expiry date", "No policy number or indemnity limit found". Empty array if there are no problems.

Rules:
- Only extract dates clearly visible on the document. Do NOT guess or invent dates.
- For a card, the expiry is typically the "Valid Until" or "Expiry" date. For insurance, use the policy expiry / valid-to date. For RAMS, use review/expiry dates.
- Return null for any date you cannot find with reasonable confidence.`,
      file_urls: [signed_url],
      response_json_schema: {
        type: 'object',
        properties: {
          detected_type: { type: 'string', enum: [...DOC_TYPES, 'Other'] },
          matches_expected: { type: ['boolean', 'null'] },
          legible: { type: 'boolean' },
          confidence: { type: 'number' },
          issue_date: { type: ['string', 'null'] },
          expiry_date: { type: ['string', 'null'] },
          issues: { type: 'array', items: { type: 'string' } },
        },
        required: ['detected_type', 'legible', 'confidence', 'issue_date', 'expiry_date', 'issues'],
      },
    });

    return Response.json({
      detected_type: result?.detected_type ?? 'Other',
      matches_expected: expected ? result?.detected_type === expected : null,
      legible: result?.legible !== false,
      confidence: typeof result?.confidence === 'number' ? result.confidence : 0,
      issue_date: result?.issue_date ?? null,
      expiry_date: result?.expiry_date ?? null,
      issues: Array.isArray(result?.issues) ? result.issues : [],
    });
    } catch (analysisError) {
      console.error('Document analysis failed (unreadable or rejected file):', analysisError);
      return Response.json({
        detected_type: null,
        matches_expected: null,
        legible: false,
        confidence: 0,
        issue_date: null,
        expiry_date: null,
        issues: ['Could not analyse this file automatically — it may be empty, corrupted, or not a readable PDF or image. Please check the file and try again, or upload anyway if you are sure it is correct.'],
      });
    }
  } catch (error) {
    console.error('Document analysis error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}