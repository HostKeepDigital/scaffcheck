import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';

// ──────────────────────────────────────────────────────────────────────────
// FILL THESE IN BEFORE PUBLISHING. Change them here only — everything below
// reads from these constants.
//
// COMPANY_NAME: use the name CONFIRMED on the Companies House register right
// now. If the "Keepsuite Technologies Ltd" rename has landed, use that. If it
// hasn't yet, use the current registered name (e.g. HostKeep Digital Ltd) and
// swap it the day the rename confirms — the company NUMBER stays the same
// either way, so that value never changes.
// ──────────────────────────────────────────────────────────────────────────
const COMPANY_NAME = '[Keepsuite Technologies Ltd]';
const COMPANY_NUMBER = '[17084415]';
const REGISTERED_OFFICE = '[37 BATTERSBY STREET, INCE, WIGAN, WN2 2LZ]';
const ICO_NUMBER = '[ZC113158]';
const CONTACT_EMAIL = '[support@keepsuitetechnologies.co.uk]';
const LAST_UPDATED = '[18/08/2026]';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-muted-foreground leading-relaxed">
        <h1 className="text-3xl font-bold text-foreground">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm">Last updated: {LAST_UPDATED}</p>

        {/* 1 */}
        <h2 className="mt-10 text-2xl font-bold text-foreground">1. About these terms</h2>
        <p className="mt-3">
          These are the terms on which <strong className="text-foreground">{COMPANY_NAME}</strong> (<strong className="text-foreground">we</strong>, <strong className="text-foreground">us</strong>, <strong className="text-foreground">our</strong>) provides the ScaffKeep service (<strong className="text-foreground">ScaffKeep</strong>, the <strong className="text-foreground">Service</strong>) to you. By creating an account, starting a free trial, or using ScaffKeep, you (<strong className="text-foreground">you</strong>, <strong className="text-foreground">your</strong>, the <strong className="text-foreground">Customer</strong>) agree to these terms. If you are agreeing on behalf of a company or other organisation, you confirm you have authority to bind it, and <strong className="text-foreground">you</strong> means that organisation.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold text-foreground">{COMPANY_NAME}</p>
          <p>A company registered in England and Wales</p>
          <p>Company number: {COMPANY_NUMBER}</p>
          <p>Registered office: {REGISTERED_OFFICE}</p>
          <p>ICO registration number: {ICO_NUMBER}</p>
          <p>Contact: {CONTACT_EMAIL}</p>
        </div>
        <p className="mt-3">
          ScaffKeep is a product of {COMPANY_NAME}, part of the Keepsuite Technologies group of products.
        </p>

        {/* 2 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">2. What ScaffKeep does — and what it does not</h2>
        <p className="mt-3">
          ScaffKeep is a record-keeping and reminder tool. It lets you store and track compliance documents for your
          operatives — including CISRS cards, public liability insurance, employers&rsquo; liability insurance and RAMS —
          shows their status at a glance, sends expiry reminders, lets operatives upload documents through secure links,
          and generates dated compliance reports.
        </p>
        <p className="mt-3 font-semibold text-foreground">
          ScaffKeep helps you stay on top of your records. It does not, and cannot, make you compliant, and it is not a
          substitute for your own legal and regulatory duties.
        </p>
        <p className="mt-3">
          You remain solely responsible for meeting your obligations — including under the Work at Height Regulations
          2005, the Construction (Design and Management) Regulations 2015, and any scheme, principal contractor or
          insurer requirements — for the accuracy of the information you hold, and for acting on what ScaffKeep shows
          you. Status indicators and reminders are aids, not guarantees. You should not rely on them as your only means
          of managing compliance.
        </p>

        {/* 3 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">3. Your account</h2>
        <p className="mt-3">
          ScaffKeep is provided for business use only. You must give accurate account information and keep it up to date.
          You are responsible for keeping your login credentials secure and for all activity that happens under your
          account. You must tell us promptly if you believe your account has been accessed without your permission.
        </p>

        {/* 4 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">4. Subscriptions, trials and payment</h2>
        <p className="mt-3">
          Pricing is per company and is based on the number of operatives you manage. Plans are available on a monthly or
          annual basis, and current prices are shown within the app at the point of purchase.
        </p>
        <p className="mt-3">
          Payments are processed by Stripe. By subscribing you also agree to Stripe&rsquo;s terms, and you authorise us,
          through Stripe, to charge your chosen payment method for the plan you select and for each renewal until you
          cancel.
        </p>
        <p className="mt-3">
          <strong className="text-foreground">Free trial.</strong> Where a free trial is offered, it is limited to one per
          customer. At the end of the trial you will be charged for the plan you selected unless you cancel before the
          trial ends.
        </p>
        <p className="mt-3">
          <strong className="text-foreground">Renewal.</strong> Subscriptions renew automatically for successive periods
          (monthly or annual, as chosen) until cancelled.
        </p>
        <p className="mt-3">
          <strong className="text-foreground">Price changes.</strong> We may change our prices. We will give you
          reasonable notice — at least 30 days — before a change takes effect at your next renewal. Prices are exclusive
          of VAT unless stated otherwise at checkout.
        </p>

        {/* 5 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">5. Changing your plan</h2>
        <p className="mt-3">
          <strong className="text-foreground">Upgrades</strong> take effect immediately. You pay the difference for the
          remainder of your current billing period, calculated on a pro-rata basis.
        </p>
        <p className="mt-3">
          <strong className="text-foreground">Downgrades</strong> take effect at the end of your current billing period.
          You keep your current plan until then, and no refund is due for the unused portion of the higher plan. If the
          number of operatives you manage falls below your plan&rsquo;s limit, you may stay on your plan or reduce it at
          your next renewal.
        </p>

        {/* 6 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">6. Cancellation, non-payment and suspension</h2>
        <p className="mt-3">
          You can cancel at any time through the billing portal. Cancellation takes effect at the end of your current paid
          period, and you keep access until then. Fees already paid are non-refundable except where the law requires
          otherwise.
        </p>
        <p className="mt-3">
          If a renewal payment fails, your subscription may lapse and access to your operatives and compliance data may be
          suspended until payment is made. We may also suspend or restrict the Service where you are in breach of these
          terms, or where it is necessary to protect the Service or our other customers.
        </p>

        {/* 7 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">7. Your responsibilities and acceptable use</h2>
        <p className="mt-3">You agree that you will:</p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>keep the information you record in ScaffKeep accurate and up to date;</li>
          <li>only upload personal data about operatives where you have a lawful basis to do so and the right to share it with us, and where you have given operatives any information legally required;</li>
          <li>not use ScaffKeep for any unlawful purpose, or upload anything harmful, malicious or infringing;</li>
          <li>not attempt to access another customer&rsquo;s data, interfere with the Service, or copy, reverse-engineer or resell it without our permission.</li>
        </ul>
        <p className="mt-3">
          You are responsible for the content that you and your operatives upload, and for making sure you have the right
          to use it.
        </p>

        {/* 8 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">8. Data protection</h2>
        <p className="mt-3">
          For the personal data in your own account (such as your name and contact details), we act as the data
          controller. How we handle it is set out in our <Link to="/privacy" className="text-foreground underline">Privacy Notice</Link>.
        </p>
        <p className="mt-3">
          For personal data about your operatives that you put into ScaffKeep, <strong className="text-foreground">you are the
          controller and we are your processor</strong> under UK data protection law. We process that data only to provide
          the Service and in line with your instructions. This processing is governed by our Privacy Notice and our Data
          Processing Agreement, which form part of these terms.
        </p>
        <p className="mt-3">
          Your data is kept isolated from other customers, documents are held in private storage, and files are made
          accessible only through short-lived, secure links.
        </p>

        {/* 9 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">9. Intellectual property</h2>
        <p className="mt-3">
          We own ScaffKeep and all intellectual property rights in it. We grant you a non-exclusive, non-transferable
          licence to use the Service for your business for as long as your subscription is active. You keep ownership of
          the content you upload, and you grant us the licence we need to host and process that content in order to
          provide the Service.
        </p>

        {/* 10 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">10. Availability and changes to the Service</h2>
        <p className="mt-3">
          We work to keep ScaffKeep available, but we do not guarantee uninterrupted access, and there may be occasional
          downtime for maintenance. We may change or improve features from time to time, and will not make changes that
          materially reduce the core functionality you are paying for without reasonable notice.
        </p>

        {/* 11 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">11. Disclaimers</h2>
        <p className="mt-3">
          The Service is provided {'"as is" and "as available"'}. We do not warrant that it will be error-free or
          uninterrupted, that reminders or notifications will always be delivered, or that using ScaffKeep will make or
          keep you compliant. You must independently satisfy yourself as to your compliance position. To the extent
          permitted by law, we exclude all warranties, terms and conditions implied by statute or otherwise.
        </p>

        {/* 12 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">12. Limitation of liability</h2>
        <p className="mt-3">
          Nothing in these terms limits or excludes our liability for death or personal injury caused by our negligence,
          for fraud, or for anything else that cannot lawfully be limited or excluded.
        </p>
        <p className="mt-3">Subject to that, we are not liable for:</p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>loss of profits, business, goodwill or anticipated savings;</li>
          <li>loss or corruption of data, beyond our reasonable efforts to restore it;</li>
          <li>fines, regulatory penalties, enforcement action or any losses arising from your own compliance failures; or</li>
          <li>any indirect or consequential loss.</li>
        </ul>
        <p className="mt-3">
          Our total liability to you for all claims arising in any 12-month period is limited to the total fees you paid
          us during that period. You acknowledge that ScaffKeep is a low-cost tool priced on the basis of these limits,
          and that you remain responsible for your own compliance obligations.
        </p>

        {/* 13 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">13. Indemnity</h2>
        <p className="mt-3">
          You agree to indemnify us against any claims, losses or costs arising from your unlawful use of the Service, or
          from your uploading of personal data without a lawful basis or the right to do so.
        </p>

        {/* 14 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">14. Term and termination</h2>
        <p className="mt-3">
          These terms apply for as long as you use ScaffKeep. You may end them by cancelling your subscription. We may end
          them on reasonable notice, or immediately if you seriously breach them. When these terms end, your right to use
          the Service stops. You can export your data before your account is closed; afterwards we will delete or return
          your data in line with our Privacy Notice and Data Processing Agreement.
        </p>

        {/* 15 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">15. Changes to these terms</h2>
        <p className="mt-3">
          We may update these terms from time to time. We will post the updated version on this page and, for material
          changes, give you reasonable notice. If you continue to use ScaffKeep after a change takes effect, you accept
          the updated terms.
        </p>

        {/* 16 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">16. Governing law</h2>
        <p className="mt-3">
          These terms and any dispute arising out of them are governed by the laws of England and Wales, and the courts of
          England and Wales have exclusive jurisdiction.
        </p>

        {/* 17 */}
        <h2 className="mt-8 text-2xl font-bold text-foreground">17. Contact</h2>
        <p className="mt-3">
          If you have any questions about these terms, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline">{CONTACT_EMAIL}</a>.
        </p>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <div className="flex justify-center gap-4 text-xs">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
          </div>
          <p className="text-xs text-muted-foreground">ScaffKeep — a {COMPANY_NAME} product.</p>
        </div>
      </footer>
    </div>
  );
}