// Where enterprise / custom-limit enquiries go.
export const SALES_EMAIL = 'admin@keepsuitetechnologies.co.uk';

export const ENTERPRISE_THRESHOLD = 80;

export function enterpriseMailto(companyName = '') {
  const subject = encodeURIComponent('[ScaffKeep] Custom plan enquiry (80+ operatives)');
  const body = encodeURIComponent(
    `Hi ScaffKeep team,\n\nWe need to track more than ${ENTERPRISE_THRESHOLD} operatives and would like a custom plan.\n\nCompany: ${companyName}\nApprox. number of operatives: \nContact name: \nPhone: \n\nThanks`
  );
  return `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;
}