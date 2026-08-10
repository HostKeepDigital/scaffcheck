import { Link } from 'react-router-dom';
import { HardHat, Mail, Building2, Clock } from 'lucide-react';
import { SALES_EMAIL } from '@/lib/contact';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border safe-area-pt">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
            <HardHat className="w-5 h-5 text-amber-500" /> ScaffKeep
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/contact" className="text-foreground font-medium">Contact</Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground">Log in</Link>
          </nav>
        </div>
      </header>

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
            <p className="mt-2 font-semibold text-foreground">Keep Technologies Ltd</p>
            <p className="text-sm text-muted-foreground">
              ScaffKeep is built and supported in the United Kingdom by Keep Technologies Ltd.
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground">ScaffKeep — a Keep Technologies Ltd product.</p>
        </div>
      </footer>
    </div>
  );
}