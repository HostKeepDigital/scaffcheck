import { Link } from 'react-router-dom';
import { Mail, Building2, Clock } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { SALES_EMAIL } from '@/lib/contact';
import { COMPANY_LEGAL_NAME } from '@/config/company';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Contact ScaffKeep</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about compliance tracking, pricing, or a workforce too big for our standard plans?
          We answer every message ourselves.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="p-5 rounded-xl border border-border bg-card">
            <Mail className="w-5 h-5 text-amber-500" />
            <p className="mt-2 font-semibold text-foreground">Email us</p>
            <a href={`mailto:${SALES_EMAIL}`} className="text-sm text-muted-foreground underline break-all">
              {SALES_EMAIL}
            </a>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <Clock className="w-5 h-5 text-amber-500" />
            <p className="mt-2 font-semibold text-foreground">Response time</p>
            <p className="text-sm text-muted-foreground">Within one working day, Monday to Friday.</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card sm:col-span-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <p className="mt-2 font-semibold text-foreground">{COMPANY_LEGAL_NAME}</p>
            <p className="text-sm text-muted-foreground">
              ScaffKeep is built and supported in the United Kingdom by {COMPANY_LEGAL_NAME}.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <a href={`mailto:${SALES_EMAIL}?subject=ScaffKeep%20enquiry`}
            className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold">
            <Mail className="w-4 h-4 mr-2" /> Send us an email
          </a>
        </div>
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