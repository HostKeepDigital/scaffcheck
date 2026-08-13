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

  let confirmed = false;
  for (const field of ['email', 'phone']) {
    const av = n(a[field]);
    const bv = n(b[field]);
    if (!av || !bv) continue; // blank on either side = no information
    if (av !== bv) return null; // populated and different = different person
    confirmed = true;
  }
  return confirmed ? 'exact' : 'possible';
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

const CONTACT_LABELS = { email: 'email address', phone: 'phone number' };

// Notes where one side has contact data the other lacks
function contactGaps(a, b) {
  const notes = [];
  for (const field of Object.keys(CONTACT_LABELS)) {
    const av = n(a[field]);
    const bv = n(b[field]);
    if (!av && bv) notes.push(`this row has no ${CONTACT_LABELS[field]}`);
    else if (av && !bv) notes.push(`the matching row has no ${CONTACT_LABELS[field]}`);
  }
  return notes;
}

const contactCount = (r) => ['email', 'phone'].filter((f) => n(r[f])).length;

// rows: parsed drafts, existing: account's current operatives, rowNumbers: CSV row numbers.
// Returns [{ status, detail }] aligned with rows.
export function detectDuplicates(rows, existing = [], rowNumbers = []) {
  return rows.map((row, i) => {
    let status = null;
    let detail = '';

    const consider = (result, other, label, sameLabel, otherRowRef = null) => {
      if (!result) return;
      if (result === 'exact' && status !== 'exact') {
        const parts = [attributeDiff(row, other), ...contactGaps(row, other)].filter(Boolean);
        status = 'exact';
        detail = parts.length ? `${label} — ${parts.join(', ')}` : sameLabel;
        if (otherRowRef !== null) {
          const mine = contactCount(row);
          const theirs = contactCount(other);
          if (mine < theirs) detail += `. Row ${otherRowRef} has more complete details — we'd keep that one.`;
          else if (mine > theirs) detail += `. Recommended — more complete than row ${otherRowRef}.`;
        }
      } else if (!status) {
        status = 'possible';
        detail = 'Same name, no matching contact details';
      }
    };

    rows.forEach((other, j) => {
      if (i === j) return;
      const rowRef = rowNumbers[j] ?? j + 2;
      consider(compare(row, other), other, `Same person as row ${rowRef}`, `Identical to row ${rowRef}`, rowRef);
    });
    existing.forEach((op) =>
      consider(compare(row, op), op, 'Matches an existing operative', 'Matches an existing operative')
    );

    return { status, detail };
  });
}