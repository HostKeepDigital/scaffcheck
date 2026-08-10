import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';
import { SALES_EMAIL } from '@/lib/contact';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border safe-area-pt">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
            <HardHat className="w-5 h-5 text-amber-500" /> ScaffKeep
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/about" className="text-foreground font-medium">About</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground">Log in</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">About ScaffKeep</h1>

        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            ScaffKeep is compliance record keeping built specifically for UK scaffolding contractors. It replaces
            the folders, spreadsheets and glovebox paperwork that most yards still rely on with a single live
            picture of who on your books is compliant and who is not. For every operative you track four things:
            their CISRS card, public liability insurance, employers liability insurance and their RAMS. ScaffKeep
            reads the dates off each document you upload, works out the status for you, and colours every
            operative red, amber or green — red for anything missing or expired, amber for anything expiring soon,
            green when the full set is valid.
          </p>
          <p>
            It is made for the people who get asked for evidence at short notice: scaffolding contractors,
            labour-only subcontractors, site managers and the office staff who chase paperwork on their behalf.
            When a principal contractor asks for proof, you export a dated compliance report for your whole
            workforce in a couple of taps instead of digging through emails. Operatives can be sent a secure
            upload link so they submit their own cards and certificates straight from a phone, without ever
            being able to see anyone else's records. Expiry reminders land before a card lapses, not after,
            so a shutdown never comes as a surprise.
          </p>
          <p>
            ScaffKeep is built and maintained by Keep Technologies Ltd, a small UK software company focused on
            practical compliance tools for the construction trades. Every account's data is isolated to that
            company, documents are held in private storage, and files are only ever served through short-lived
            secure links. Plans scale from small crews to firms tracking dozens of operatives, and larger
            workforces are handled on a custom plan — just{' '}
            <Link to="/contact" className="underline text-foreground">get in touch</Link> or email{' '}
            <a href={`mailto:${SALES_EMAIL}`} className="underline text-foreground">{SALES_EMAIL}</a>.
          </p>
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