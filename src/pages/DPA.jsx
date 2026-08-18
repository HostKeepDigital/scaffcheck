import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import {
  COMPANY_LEGAL_NAME,
  COMPANY_NUMBER,
  REGISTERED_OFFICE,
  ICO_NUMBER,
  CONTACT_EMAIL,
  LAST_UPDATED,
} from '@/config/company';

export default function DPA() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-muted-foreground leading-relaxed">
        <h1 className="text-3xl font-bold text-foreground">Data Processing Agreement</h1>
        <p className="mt-2 text-sm">Last updated: {LAST_UPDATED}</p>

        <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold text-foreground">{COMPANY_LEGAL_NAME}</p>
          <p>A company registered in England and Wales</p>
          <p>Company number: {COMPANY_NUMBER}</p>
          <p>Registered office: {REGISTERED_OFFICE}</p>
          <p>ICO registration number: {ICO_NUMBER}</p>
          <p>Contact: {CONTACT_EMAIL}</p>
        </div>

        <h2 className="mt-8 text-2xl font-bold text-foreground">1. About this agreement</h2>
        <p className="mt-3">
          This Data Processing Agreement (DPA) forms part of the ScaffKeep{' '}
          <Link to="/terms" className="text-foreground underline">Terms &amp; Conditions</Link> between you (the Customer)
          and {COMPANY_LEGAL_NAME} (we, us). It applies where we process personal data about your operatives on your
          behalf. For that data, you are the controller and we are your processor under UK data protection law. You accept
          this DPA when you agree to the Terms.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">2. Subject matter and duration</h2>
        <p className="mt-3">
          We process operatives&rsquo; personal data for the purpose of providing ScaffKeep, for as long as your
          subscription is active, plus any short period needed to return or delete the data afterwards.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">3. Nature and purpose of processing</h2>
        <p className="mt-3">
          Storing, organising, retrieving and transmitting operatives&rsquo; compliance documents and related details;
          sending document-upload requests and expiry reminders; and generating compliance reports.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">4. Type of personal data</h2>
        <p className="mt-3">
          Operative names and contact details; CISRS card details; public and employers&rsquo; liability insurance
          details; RAMS; uploaded document files; and associated dates.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">5. Categories of data subjects</h2>
        <p className="mt-3">Your operatives and workers.</p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">6. Our obligations as processor</h2>
        <p className="mt-3">We will:</p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>process the personal data only on your documented instructions (including on transfers), unless the law requires otherwise, in which case we will tell you unless the law prevents us;</li>
          <li>ensure that people authorised to process the data are under a duty of confidentiality;</li>
          <li>put in place appropriate technical and organisational security measures, including keeping each customer&rsquo;s data isolated from others, holding documents in private storage, making files accessible only through short-lived secure links, encrypting data in transit, and restricting access;</li>
          <li>use only the sub-processors listed below, impose equivalent data-protection terms on them, and give you advance notice of any change and a chance to object;</li>
          <li>assist you, taking account of the nature of the processing, in responding to requests from operatives to exercise their rights;</li>
          <li>assist you with security, personal data breach notification, data protection impact assessments and prior consultation, and notify you without undue delay if we become aware of a personal data breach affecting your data;</li>
          <li>at your choice, delete or return all the personal data at the end of the service and delete existing copies, unless the law requires us to keep it; and</li>
          <li>make available the information you reasonably need to demonstrate compliance with this DPA, and allow for and contribute to audits.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-foreground">7. Sub-processors</h2>
        <p className="mt-3">
          We use Base44 (application hosting) and Resend (sending upload requests and reminders, which include
          operatives&rsquo; email addresses) to process operatives&rsquo; personal data on our behalf. (Stripe processes
          your own account and billing data, not operatives&rsquo; data — see our{' '}
          <Link to="/privacy" className="text-foreground underline">Privacy Notice</Link>.)
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">8. International transfers</h2>
        <p className="mt-3">
          Where a sub-processor processes personal data outside the UK, it is protected by an appropriate safeguard: a UK
          adequacy decision, or the UK International Data Transfer Agreement (or the UK Addendum to the SCCs).
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">9. Liability</h2>
        <p className="mt-3">
          The limitations and exclusions of liability in the Terms apply to this DPA.
        </p>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/dpa" className="text-muted-foreground hover:text-foreground">DPA</Link>
          </div>
          <p className="text-xs text-muted-foreground">ScaffKeep — a {COMPANY_LEGAL_NAME} product.</p>
        </div>
      </footer>
    </div>
  );
}