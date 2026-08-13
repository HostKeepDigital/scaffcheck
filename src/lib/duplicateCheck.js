// Duplicate DETECTION only — rows are never removed automatically.
const FIELDS = ['full_name', 'email', 'phone', 'role', 'company_name', 'notes'];
const n = (v) => String(v || '').trim().toLowerCase();

// Returns 'exact' | 'possible' | null
function compare(a, b) {
  if (!n(a.full_name) || n(a.full_name) !== n(b.full_name)) return null;
  const conflict = FIELDS.some((f) => n(a[f]) && n(b[f]) && n(a[f]) !== n(b[f]));
  const distinguishing = ['email', 'phone'].some((f) => n(a[f]) && n(b[f]) && n(a[f]) === n(b[f]));
  if (distinguishing && !conflict) return 'exact';
  return 'possible';
}

// rows: parsed drafts, existing: account's current operatives.
// Returns [{ status, reason }] aligned with rows.
export function detectDuplicates(rows, existing = []) {
  return rows.map((row, i) => {
    let status = null;
    let reason = '';
    const consider = (result, label) => {
      if (!result) return;
      if (result === 'exact' && status !== 'exact') { status = 'exact'; reason = label; }
      else if (!status) { status = 'possible'; reason = label; }
    };

    rows.forEach((other, j) => {
      if (i === j) return;
      consider(compare(row, other), 'another row in this file');
    });
    existing.forEach((op) => consider(compare(row, op), 'an existing operative'));

    return { status, reason };
  });
}