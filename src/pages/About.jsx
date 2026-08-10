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
        <h1 className="text-3xl font-bold text-foreground">ScaffKeep</h1>
        <p className="mt-2 text-lg font-semibold text-foreground">Compliance, without the paperwork chase.</p>

        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            ScaffKeep is compliance record keeping built specifically for{' '}
            <strong className="text-foreground">UK scaffolding contractors</strong>.
          </p>
          <p>
            It replaces the folders, spreadsheets, emails and glovebox paperwork that many yards still rely on with{' '}
            <strong className="text-foreground">one live view of your workforce compliance</strong>.
          </p>
          <p>For every operative, ScaffKeep tracks four essential records:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground">CISRS card</strong></li>
            <li><strong className="text-foreground">Public Liability Insurance</strong></li>
            <li><strong className="text-foreground">Employers’ Liability Insurance</strong></li>
            <li><strong className="text-foreground">RAMS</strong></li>
          </ul>
          <p>
            Upload a document and ScaffKeep reads the relevant dates, works out the current status and keeps
            everything up to date automatically. Every operative is clearly marked{' '}
            <strong className="text-foreground">red, amber or green</strong> — red if something is missing or
            expired, amber if it is approaching expiry, and green when everything is valid.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Know who is compliant at a glance.</h2>
          <p>
            No more searching through folders. No more checking spreadsheets against emails. No more wondering
            whether a certificate is still valid.
          </p>
          <p>
            ScaffKeep gives contractors, site managers and office teams a{' '}
            <strong className="text-foreground">single, live picture of their compliance position</strong>.
          </p>
          <p>
            When a principal contractor asks for evidence, generate a{' '}
            <strong className="text-foreground">dated compliance report for your workforce in just a few taps</strong>.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Let operatives upload their own documents.</h2>
          <p>
            Send an operative a secure upload link and they can submit their CISRS card, insurance documents and
            other records directly from their phone.
          </p>
          <p>
            They only have access to their own upload area —{' '}
            <strong className="text-foreground">never another operative's records</strong>.
          </p>
          <p>That means less paperwork for the office and less time spent chasing people for documents.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Stay ahead of expiries.</h2>
          <p>ScaffKeep monitors expiry dates and sends reminders before important documents lapse.</p>
          <p>
            Instead of finding out that a card or certificate has expired when you're asked for it on site, you can
            deal with it <strong className="text-foreground">before it becomes a problem</strong>.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Built for scaffolding contractors.</h2>
          <p>
            ScaffKeep is designed around the way UK scaffolding businesses actually work — from small local crews
            and labour-only subcontractors to larger contractors managing dozens of operatives.
          </p>
          <p>
            Plans scale with your workforce, with{' '}
            <strong className="text-foreground">custom options available for larger teams</strong>.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Built by Keep Technologies Ltd</h2>
          <p>
            ScaffKeep is built and maintained by{' '}
            <strong className="text-foreground">Keep Technologies Ltd</strong>, a UK software company focused on
            creating practical compliance tools for the construction trades.
          </p>
          <p>
            Your company's data is isolated from other customers, documents are stored in private storage, and files
            are only made accessible through{' '}
            <strong className="text-foreground">short-lived, secure links</strong>.
          </p>
          <p className="font-semibold text-foreground pt-2">Less paperwork. Less chasing. Fewer surprises.</p>
          <p className="font-semibold text-foreground">ScaffKeep — know who's compliant before someone asks.</p>

          <p>
            Larger workforces are handled on a custom plan — just{' '}
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