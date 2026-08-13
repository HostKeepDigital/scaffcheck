// Duplicate DETECTION only — rows are never removed automatically.
// Identity is full_name + email + phone. Role, company and notes may legitimately differ.
const ATTR_LABELS = {
  role: 'role',
  company_name: 'company name',
  notes: 'notes',
};
const n = (v) => String(v || '').trim().toLowerCase();

// Returns 'exact' | 'possible' | null
function compare(a, b) {
  if (!n(a.full_name) || n(a.full_name) !== n(b.full_name)) return null;
  const emailMatch = n(a.email) === n(b.email);
  const phoneMatch = n(a.phone) === n(b.phone);
  const hasContact = n(a.email) || n(a.phone) || n(b.email) || n(b.phone);
  if (!hasContact) return 'possible';
  if (emailMatch && phoneMatch) return 'exact';
  return null;
}

// First non-identity field that differs, e.g. "role differs (A vs B)"
function attributeDiff(a, b) {
  for (const field of Object.keys(ATTR_LABELS)) {
    const av = String(a[field] || '').trim();
    const bv = String(b[field] || '').trim();
    if (n(av) !== n(bv)) {
      return `${ATTR_LABELS[field]} differs (${av || '—'} vs ${bv || '—'})`;
    }
  }
  return null;
}

// rows: parsed drafts, existing: account's current operatives, rowNumbers: CSV row numbers.
// Returns [{ status, detail }] aligned with rows.
export function detectDuplicates(rows, existing = [], rowNumbers = []) {
  return rows.map((row, i) => {
    let status = null;
    let detail = '';

    const consider = (result, other, label, sameLabel) => {
      if (!result) return;
      if (result === 'exact' && status !== 'exact') {
        const diff = attributeDiff(row, other);
        status = 'exact';
        detail = diff ? `${label} — ${diff}` : sameLabel;
      } else if (!status) {
        status = 'possible';
        detail = 'Same name, no matching contact details';
      }
    };

    rows.forEach((other, j) => {
      if (i === j) return;
      const rowRef = rowNumbers[j] ?? j + 2;
      consider(compare(row, other), other, `Same person as row ${rowRef}`, `Identical to row ${rowRef}`);
    });
    existing.forEach((op) =>
      consider(compare(row, op), op, 'Matches an existing operative', 'Matches an existing operative')
    );

    return { status, detail };
  });
}