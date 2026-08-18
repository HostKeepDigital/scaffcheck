import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import {
  COMPANY_LEGAL_NAME,
  COMPANY_NUMBER,
  REGISTERED_OFFICE,
  ICO_NUMBER,
  CONTACT_EMAIL,
  BRAND_NAME,
  LAST_UPDATED,
} from '@/config/company';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-muted-foreground leading-relaxed">
        <h1 className="text-3xl font-bold text-foreground">Privacy Notice</h1>
        <p className="mt-2 text-sm">Last updated: {LAST_UPDATED}</p>

        <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold text-foreground">{COMPANY_LEGAL_NAME}</p>
          <p>A company registered in England and Wales</p>
          <p>Company number: {COMPANY_NUMBER}</p>
          <p>Registered office: {REGISTERED_OFFICE}</p>
          <p>ICO registration number: {ICO_NUMBER}</p>
          <p>Contact: {CONTACT_EMAIL}</p>
        </div>

        <h2 className="mt-8 text-2xl font-bold text-foreground">1. Who we are</h2>
        <p className="mt-3">
          {COMPANY_LEGAL_NAME}, a company registered in England and Wales, company number {COMPANY_NUMBER}, registered
          office {REGISTERED_OFFICE}, ICO registration {ICO_NUMBER}. Contact{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline">{CONTACT_EMAIL}</a>. We are not
          required to have a Data Protection Officer; contact us at that address about anything in this notice. ScaffKeep
          is a product of the {BRAND_NAME} group.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">2. What this notice covers</h2>
        <p className="mt-3">
          This notice explains how we handle personal data for which we are the controller: the data of the account holder
          who signs up, and people who visit our website. Personal data about your operatives that you enter into
          ScaffKeep is handled under a different arrangement — there you are the controller and we are your processor;
          that is governed by our <Link to="/dpa" className="text-foreground underline">Data Processing Agreement</Link>.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">3. The data we collect</h2>
        <ul className="mt-3 list-disc pl-6 space-y-1">
          <li>Account data — your name, email, company name, and a securely hashed password.</li>
          <li>Billing data — your billing details and payment history are handled by Stripe; we do not see or store full card numbers.</li>
          <li>Technical and usage data — IP address, device and browser information, and log data when you use the app.</li>
          <li>Anything you send us in support messages.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-foreground">4. Why we use it, and our lawful basis</h2>
        <ul className="mt-3 list-disc pl-6 space-y-1">
          <li>To provide and run ScaffKeep and your account — performance of our contract.</li>
          <li>To take payment and manage your subscription — performance of our contract.</li>
          <li>To keep accounting and tax records — legal obligation.</li>
          <li>To keep the service secure and prevent fraud or abuse — our legitimate interests in protecting the service and our users.</li>
          <li>To respond to your support requests — our contract and our legitimate interest in helping you.</li>
          <li>To send you service and account emails (e.g. billing, security) — performance of our contract.</li>
          <li>To send you marketing about ScaffKeep, where we do so — your consent, or the {'"soft opt-in"'} where you are an existing customer, and you can opt out any time.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-foreground">5. Who we share it with</h2>
        <p className="mt-3">
          We use trusted providers who process data on our behalf: Base44 (application hosting and platform), Stripe
          (payment processing), and Resend (sending our emails). We may also share data with professional advisers, or
          with authorities where the law requires it. We do not sell your personal data.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">6. Storing and transferring data outside the UK</h2>
        <p className="mt-3">
          Some of our providers are based outside the UK. Where personal data is transferred outside the UK, we make sure
          it is protected by an appropriate safeguard — either a UK {'"adequacy"'} decision for the country concerned, or
          the UK&rsquo;s International Data Transfer Agreement (or the UK Addendum to the Standard Contractual Clauses).
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">7. How long we keep it</h2>
        <p className="mt-3">
          We keep account data for as long as you have an account and for a short period afterwards. We keep billing and
          accounting records for around six years to meet tax and legal requirements. We keep support correspondence for
          as long as needed to handle your query and our records.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">8. Your rights</h2>
        <p className="mt-3">
          You have the right to access your data; to have it corrected; to have it erased; to restrict or object to how we
          use it; to data portability; and, where we rely on consent, to withdraw it at any time. To exercise any of
          these, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline">{CONTACT_EMAIL}</a>.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">9. Automated processing</h2>
        <p className="mt-3">
          We use automated tools to read expiry dates from documents uploaded to ScaffKeep. This helps populate reminders;
          it does not make decisions that produce legal or similarly significant effects about any individual, so it is
          not {'"automated decision-making"'} of the kind that carries extra rights.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">10. Cookies</h2>
        <p className="mt-3">
          We use only essential cookies needed to log you in and keep your session secure. If we ever introduce
          non-essential cookies (such as analytics), we will ask for your consent first.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">11. Complaints</h2>
        <p className="mt-3">
          If you have a concern, please contact us first. You also have the right to complain to the Information
          Commissioner&rsquo;s Office (ICO) at ico.org.uk, or by calling the ICO helpline.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">12. Changes to this notice</h2>
        <p className="mt-3">
          We may update this notice from time to time and will post the current version on this page.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">13. Contact</h2>
        <p className="mt-3">
          Questions about this notice:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline">{CONTACT_EMAIL}</a>.
        </p>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/dpa" className="text-muted-foreground hover:text-foreground">Data Processing Agreement</Link>
          </div>
          <p className="text-xs text-muted-foreground">ScaffKeep — a {COMPANY_LEGAL_NAME} product.</p>
        </div>
      </footer>
    </div>
  );
}