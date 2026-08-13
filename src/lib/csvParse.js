// Minimal CSV parser (handles quoted fields, commas and newlines inside quotes).
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); field = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((v) => v.trim() !== '')) rows.push(row);
  return rows;
}

// Accepted header spellings for each Operative field.
const FIELD_ALIASES = {
  full_name: ['full name', 'fullname', 'name', 'operative', 'operative name', 'employee name'],
  company_name: ['company', 'company name', 'employer', 'subcontractor', 'firm'],
  email: ['email', 'email address', 'e-mail'],
  phone: ['phone', 'phone number', 'mobile', 'telephone', 'tel', 'contact number'],
  role: ['role', 'job title', 'title', 'position', 'trade', 'grade'],
  notes: ['notes', 'note', 'comments', 'comment'],
};

const norm = (s) => String(s || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

// Map CSV headers -> operative fields. Returns { map: {index: field}, unmapped: [header] }
export function mapHeaders(headers) {
  const map = {};
  const unmapped = [];
  headers.forEach((h, i) => {
    const n = norm(h);
    const field = Object.keys(FIELD_ALIASES).find(
      (f) => f === n.replace(/ /g, '_') || FIELD_ALIASES[f].includes(n)
    );
    if (field && !Object.values(map).includes(field)) map[i] = field;
    else if (h.trim()) unmapped.push(h.trim());
  });
  return { map, unmapped };
}

// Turn a parsed CSV into operative drafts + row-level errors.
export function csvToOperatives(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) return { operatives: [], errors: [], unmapped: [], headers: [] };

  const headers = rows[0];
  const { map, unmapped } = mapHeaders(headers);
  const mappedFields = Object.values(map);

  if (!mappedFields.includes('full_name')) {
    return {
      operatives: [], unmapped, headers, mappedFields,
      errors: [{ row: 1, message: 'No name column found. Add a column headed "Full Name".' }],
    };
  }

  const operatives = [];
  const rowNumbers = [];
  const errors = [];

  rows.slice(1).forEach((cells, idx) => {
    const rowNum = idx + 2;
    const draft = {};
    Object.entries(map).forEach(([i, field]) => {
      const value = (cells[Number(i)] || '').trim();
      if (value) draft[field] = value;
    });

    operatives.push(draft);
    rowNumbers.push(rowNum);
  });

  return { operatives, rowNumbers, errors, unmapped, headers, mappedFields };
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Field validation. Rejected rows cannot be imported; warnings never block.
// Returns [{ rejected, reason, warnings: [] }] aligned with operatives.
export function validateOperatives(operatives) {
  const byEmail = {};
  operatives.forEach((o) => {
    const key = String(o.email || '').trim().toLowerCase();
    if (!key) return;
    (byEmail[key] = byEmail[key] || []).push(String(o.full_name || '').trim());
  });

  return operatives.map((o) => {
    if (!String(o.full_name || '').trim()) {
      return { rejected: true, reason: 'No name — this row cannot be imported', warnings: [] };
    }
    const warnings = [];
    const email = String(o.email || '').trim();
    if (!email) {
      warnings.push("No email — you won't be able to send this operative an upload link.");
    } else if (!EMAIL_RE.test(email)) {
      warnings.push("Email doesn't look valid — invites may not arrive.");
    }
    const sharers = (byEmail[email.toLowerCase()] || []).filter(
      (name) => name.toLowerCase() !== String(o.full_name).trim().toLowerCase()
    );
    if (email && sharers.length > 0) {
      warnings.push(`Shared email — this address is also used by ${[...new Set(sharers)].join(', ')}.`);
    }
    return { rejected: false, reason: '', warnings };
  });
}

export const CSV_TEMPLATE =
  'Full Name,Company,Email,Phone,Role,Notes\n' +
  'John Smith,Acme Scaffolding Ltd,john@acme.co.uk,07700 900123,Advanced Scaffolder,\n' +
  'Dave Jones,Acme Scaffolding Ltd,dave@acme.co.uk,07700 900456,Labourer,New starter\n';