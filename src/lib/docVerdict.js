// Thresholds for acting on the document scanner's verdict — tune here.
export const BLOCK_CONFIDENCE = 0.6; // confident mismatch => hard block
export const LOW_CONFIDENCE = 0.4;   // below this => warn and ask for confirmation

const FAILED_MESSAGE = "We couldn't automatically check this document. Please make sure it's the right file before uploading.";

export function classifyVerdict(result, expectedType) {
  if (!result || !result.detected_type) {
    return { outcome: 'warn', message: FAILED_MESSAGE, issues: [] };
  }

  const {
    detected_type: detectedType,
    matches_expected: matchesExpected,
    legible,
    confidence = 0,
    issues = [],
  } = result;

  const mismatch = matchesExpected === false;

  if (mismatch && confidence >= BLOCK_CONFIDENCE) {
    return {
      outcome: 'block',
      message: `This looks like a ${detectedType === 'Other' ? 'different kind of document' : detectedType}, but this slot is for ${expectedType}. Please upload the correct document.`,
      issues,
    };
  }

  if (legible === false) {
    return {
      outcome: 'warn',
      message: "We couldn't read this document clearly. Check it's in focus and fully in frame.",
      issues,
    };
  }

  if (mismatch) {
    return {
      outcome: 'warn',
      message: `We think this might be a ${detectedType === 'Other' ? 'different kind of document' : detectedType} rather than ${expectedType}, but we're not certain.`,
      issues,
    };
  }

  if (confidence < LOW_CONFIDENCE) {
    return {
      outcome: 'warn',
      message: `We couldn't confirm this is a ${expectedType}. Please double-check before uploading.`,
      issues,
    };
  }

  return { outcome: 'clean', message: '', issues: [] };
}