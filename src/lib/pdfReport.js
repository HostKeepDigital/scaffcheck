import { jsPDF } from 'jspdf';
import { getOperativeCompliance, formatDate, REQUIRED_DOC_TYPES, RAG_META, DOC_STATUS_META } from '@/lib/compliance';

const RAG_COLORS = {
  green: [22, 163, 74],
  amber: [217, 119, 6],
  red: [220, 38, 38],
};

const STATUS_COLORS = {
  valid: [22, 163, 74],
  expiring_soon: [217, 119, 6],
  expired: [220, 38, 38],
  missing: [107, 114, 128],
};

export function generateComplianceReport(companyName, operatives, documentsByOperative, scope = 'Company', operativeName = '') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Header band
  doc.setFillColor(15, 23, 42); // dark navy
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName || 'ScaffKeep', margin, 13);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  doc.text(`Report generated: ${dateStr}`, margin, 21);
  doc.text('ScaffKeep Compliance Report', pageWidth - margin, 21, { align: 'right' });

  y = 36;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Operatives: ${operatives.length}`, margin, y);
  y += 8;

  let opIndex = 0;
  for (const op of operatives) {
    const docs = documentsByOperative[op.id] || [];
    const { rag, documentStatuses } = getOperativeCompliance(docs);

    // Check if we need a new page
    if (y > pageHeight - 50) {
      doc.addPage();
      y = margin;
    }

    // Divider line between operatives (not before the first)
    if (opIndex > 0) {
      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }
    opIndex++;

    // Operative header
    doc.setTextColor(15, 23, 42);   // reset to dark: fixes names after the first rendering white/invisible
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(op.full_name, margin, y);
    y += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    if (op.company_name) {
      doc.text(`Company: ${op.company_name}`, margin, y);
      y += 4;
    }
    if (op.role) {
      doc.text(`Role: ${op.role}`, margin, y);
      y += 4;
    }

    // RAG badge
    const ragColor = RAG_COLORS[rag];
    doc.setFillColor(...ragColor);
    doc.roundedRect(pageWidth - margin - 45, y - 4, 45, 6, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    const ragLabel = rag.toUpperCase() + ' — ' + RAG_META[rag].label;
    doc.text(ragLabel, pageWidth - margin - 22.5, y, { align: 'center' });
    doc.setTextColor(15, 23, 42);
    y += 6;

    // Document table header
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, pageWidth - 2 * margin, 6, 'F');
    doc.setTextColor(60, 60, 60);
    doc.text('Document Type', margin + 2, y + 4);
    doc.text('Issue Date', margin + 80, y + 4);
    doc.text('Expiry Date', margin + 115, y + 4);
    doc.text('Status', pageWidth - margin - 25, y + 4);
    y += 6;

    // Document rows
    doc.setFont('helvetica', 'normal');
    for (const ds of documentStatuses) {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = margin;
      }
      doc.setTextColor(40, 40, 40);
      doc.text(ds.type, margin + 2, y + 4);
      doc.text(ds.document?.issue_date ? formatDate(ds.document.issue_date) : '—', margin + 80, y + 4);
      doc.text(ds.document?.expiry_date ? formatDate(ds.document.expiry_date) : '—', margin + 115, y + 4);

      // Status badge
      const statusColor = STATUS_COLORS[ds.status];
      doc.setFillColor(...statusColor);
      doc.roundedRect(pageWidth - margin - 28, y + 0.5, 28, 5, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(DOC_STATUS_META[ds.status].label, pageWidth - margin - 14, y + 4, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      y += 6;
    }
    y += 8;
  }

  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const sanitize = (s) => String(s || '').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
  const scopePart = (scope === 'Operative' && operativeName) ? `Operative-${sanitize(operativeName)}` : 'Company';
  doc.save(`ScaffKeep-Compliance-Report-${scopePart}-${stamp}.pdf`);
}

export function generateSingleOperativeReport(companyName, operative, documents) {
  generateComplianceReport(companyName, [operative], { [operative.id]: documents }, 'Operative', operative.full_name);
}