export const REQUIRED_DOC_TYPES = [
  "CISRS Card",
  "Public Liability Insurance",
  "Employers Liability Insurance",
  "RAMS",
];

export const EXPIRY_WARNING_DAYS = 30;

export const RAG_META = {
  green: { bg: "#16A34A", text: "#FFFFFF", label: "Compliant" },
  amber: { bg: "#D97706", text: "#FFFFFF", label: "Action needed" },
  red: { bg: "#DC2626", text: "#FFFFFF", label: "Non-compliant" },
};

export const DOC_STATUS_META = {
  valid: { bg: "#16A34A", text: "#FFFFFF", label: "Valid" },
  expiring_soon: { bg: "#D97706", text: "#FFFFFF", label: "Expiring Soon" },
  expired: { bg: "#DC2626", text: "#FFFFFF", label: "Expired" },
  missing: { bg: "#6B7280", text: "#FFFFFF", label: "Missing" },
};

export function getDocumentStatus(expiryDate) {
  if (!expiryDate) return "missing";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate + "T00:00:00");
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "expired";
  if (diffDays <= EXPIRY_WARNING_DAYS) return "expiring_soon";
  return "valid";
}

export function getCurrentDocuments(documents) {
  const byType = {};
  for (const doc of documents || []) {
    const ts = doc.uploaded_at || doc.created_date;
    const existing = byType[doc.document_type];
    if (!existing || new Date(ts) > new Date(existing.uploaded_at || existing.created_date)) {
      byType[doc.document_type] = doc;
    }
  }
  return byType;
}

export function getOperativeCompliance(documents) {
  const current = getCurrentDocuments(documents);
  const documentStatuses = REQUIRED_DOC_TYPES.map((type) => {
    const doc = current[type];
    const status = doc ? getDocumentStatus(doc.expiry_date) : "missing";
    return { type, document: doc || null, status };
  });

  const hasMissing = documentStatuses.some((s) => s.status === "missing");
  const hasExpired = documentStatuses.some((s) => s.status === "expired");
  const hasExpiringSoon = documentStatuses.some((s) => s.status === "expiring_soon");

  let rag;
  if (hasMissing || hasExpired) rag = "red";
  else if (hasExpiringSoon) rag = "amber";
  else rag = "green";

  return { rag, documentStatuses };
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}