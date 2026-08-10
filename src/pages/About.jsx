import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

const CHECKLIST = [
  'Track CISRS cards',
  'Track insurance documentation',
  'Record RAMS',
  'Automatically monitor expiry dates',
  'See workforce status at a glance',
  'Receive expiry reminders',
  'Let operatives upload their own documents',
  'Generate dated compliance reports',
  'Keep documents securely stored',
  'Manage your entire workforce from one place',
];

const RECORDS = [
  ['CISRS Card', 'Know who is qualified and when their card expires.'],
  ['Public Liability Insurance', "Keep insurance records together and instantly see what's current."],
  ["Employers' Liability Insurance", 'Track certificates and expiry dates without relying on spreadsheets.'],
  ['RAMS', 'Keep the relevant documentation recorded against each operative.'],
];

const RAG = [
  ['🔴', 'RED — Action required', 'Something is missing, expired or invalid.'],
  ['🟠', 'AMBER — Expiring soon', "You've got time to act before it becomes a problem."],
  ['🟢', 'GREEN — Compliant', 'Everything required is present and in date.'],
];

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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-muted-foreground leading-relaxed">
        <h1 className="text-3xl font-bold text-foreground">ScaffKeep</h1>
        <h2 className="mt-2 text-2xl font-bold text-foreground">
          Stop chasing paperwork. Start knowing you're compliant.
        </h2>
        <p className="mt-3 font-semibold text-foreground">
          The simple compliance platform built specifically for UK scaffolding contractors.
        </p>

        <div className="mt-4 space-y-1">
          <p>No more digging through folders.</p>
          <p>No more hunting through spreadsheets.</p>
          <p>No more chasing operatives for expired cards and certificates.</p>
          <p>No more panic when a principal contractor asks for proof.</p>
        </div>

        <p className="mt-4 font-semibold text-foreground">
          ScaffKeep puts your entire workforce compliance in one place — and tells you exactly what's missing,
          what's expiring and what's already covered.
        </p>

        <h3 className="mt-10 text-xl font-semibold text-foreground">Your workforce. Your compliance. One live view.</h3>
        <p className="mt-2">For every operative, ScaffKeep tracks the four key records you need:</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {RECORDS.map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <p className="font-semibold text-foreground">{title}</p>
              <p className="text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          ScaffKeep automatically reads dates from uploaded documents and calculates their current status.
        </p>

        <h3 className="mt-10 text-xl font-semibold text-foreground">🔴 Red. 🟠 Amber. 🟢 Green.</h3>
        <p className="mt-2">You don't need to open ten different files to work out who's compliant.</p>
        <p className="mt-2">ScaffKeep gives you an instant visual overview:</p>
        <div className="mt-4 space-y-3">
          {RAG.map(([dot, title, desc]) => (
            <div key={title} className="flex gap-3">
              <span aria-hidden>{dot}</span>
              <div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-semibold text-foreground">One glance. Your compliance position.</p>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold text-foreground">
          When a principal contractor asks for proof, be ready.
        </h2>
        <p className="mt-3">We've all been there.</p>
        <p className="mt-2 italic">
          "Can you send over your operatives' CISRS cards and insurance documents?"
        </p>
        <p className="mt-2">Then starts the search.</p>
        <div className="mt-2 space-y-1">
          <p>Emails.</p>
          <p>Folders.</p>
          <p>WhatsApp messages.</p>
          <p>Spreadsheets.</p>
          <p>Someone's van.</p>
          <p>Someone else's laptop.</p>
        </div>
        <p className="mt-3">With ScaffKeep, it's already there.</p>
        <p className="mt-2 font-semibold text-foreground">
          Generate a dated compliance report for your workforce in just a few taps.
        </p>
        <p className="mt-2">Send the evidence you need without spending half an afternoon finding it.</p>

        <h3 className="mt-10 text-xl font-semibold text-foreground">Stop chasing operatives for paperwork.</h3>
        <p className="mt-2">
          ScaffKeep lets you send operatives a <strong className="text-foreground">secure upload link</strong>.
        </p>
        <p className="mt-2">
          They upload their documents directly from their phone. You get the records. ScaffKeep keeps track of the
          dates.
        </p>
        <p className="mt-2">
          And because each upload link is restricted to that operative,{' '}
          <strong className="text-foreground">they can't see anyone else's information.</strong>
        </p>
        <div className="mt-3 space-y-1">
          <p>Less chasing for your office team.</p>
          <p>Less hassle for your operatives.</p>
          <p>Less paperwork for everyone.</p>
        </div>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold text-foreground">Know about an expiry before it costs you work.</h2>
        <div className="mt-3 space-y-2">
          <p>A CISRS card expires.</p>
          <p>An insurance certificate runs out.</p>
          <p>A document gets forgotten.</p>
        </div>
        <p className="mt-2">
          And suddenly you're trying to fix a compliance issue when you should be getting on with the job.
        </p>
        <p className="mt-3 font-semibold text-foreground">
          ScaffKeep monitors your records and reminds you before important documents expire.
        </p>
        <p className="mt-2">
          So you can renew, replace or update them{' '}
          <strong className="text-foreground">before they become a problem.</strong>
        </p>
        <p className="mt-2">
          Because finding out you're non-compliant after someone asks for the paperwork is too late.
        </p>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold text-foreground">Built for scaffolding. Not adapted for it.</h2>
        <p className="mt-3">
          ScaffKeep isn't a generic document storage system with a scaffolding logo on it.
        </p>
        <p className="mt-2">
          It's built around the compliance records and day-to-day problems faced by{' '}
          <strong className="text-foreground">
            UK scaffolding contractors, labour-only subcontractors, site managers and the people responsible for
            keeping the paperwork in order.
          </strong>
        </p>
        <p className="mt-2">
          Whether you're managing a small crew or dozens of operatives, ScaffKeep gives you a straightforward way to
          keep everything organised.
        </p>

        <h3 className="mt-8 text-xl font-semibold text-foreground">
          From the yard to the site office, everything stays in one place.
        </h3>
        <div className="mt-2 space-y-1 font-semibold text-foreground">
          <p>No spreadsheets.</p>
          <p>No filing cabinets.</p>
          <p>No paperwork mountain.</p>
          <p>No guessing.</p>
        </div>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold text-foreground">Compliance shouldn't live in a glovebox.</h2>
        <p className="mt-3">Your business is already complicated enough.</p>
        <p className="mt-2">Your compliance system shouldn't be.</p>

        <h3 className="mt-8 text-xl font-semibold text-foreground">With ScaffKeep you can:</h3>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span> {item}
            </li>
          ))}
        </ul>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold text-foreground">Ready when they ask.</h2>
        <p className="mt-3">The next time a principal contractor asks:</p>
        <p className="mt-2 font-semibold text-foreground">"Can you send us your compliance records?"</p>
        <p className="mt-2">You shouldn't have to start searching.</p>
        <p className="mt-2 font-semibold text-foreground">You should already have them.</p>

        <h3 className="mt-8 text-xl font-semibold text-foreground">
          Get ScaffKeep and take control of your workforce compliance.
        </h3>
        <p className="mt-3 font-semibold text-foreground">Less paperwork. Less chasing. Fewer surprises.</p>
        <p className="mt-6 text-lg font-bold text-foreground">ScaffKeep</p>
        <p className="font-semibold text-foreground">Compliance made for scaffolding.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/register"
            className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold">
            Get Started
          </Link>
          <Link to="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-border font-semibold text-foreground hover:bg-accent">
            See How It Works
          </Link>
        </div>

        <p className="mt-6 text-sm italic">Built and maintained in the UK by Keep Technologies Ltd.</p>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground">ScaffKeep — a Keep Technologies Ltd product.</p>
        </div>
      </footer>
    </div>
  );
}