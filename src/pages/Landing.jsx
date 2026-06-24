import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { HardHat, ShieldCheck, BellRing, FileText, Upload, ArrowRight, Check } from 'lucide-react';
import { PLANS } from '@/lib/stripePrices';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: ShieldCheck, title: 'RAG Dashboard', desc: 'See at a glance who is compliant, who needs action, and who is non-compliant — colour-coded Red, Amber, Green.' },
    { icon: BellRing, title: 'Automatic Alerts', desc: 'Email reminders at 30, 14, 7, 3, 1 days before expiry and on the day it expires. Never get caught out.' },
    { icon: FileText, title: 'One-Tap Reports', desc: 'Generate a professional PDF compliance report for any main contractor or HSE auditor in a single click.' },
    { icon: Upload, title: 'Operative Self-Upload', desc: 'Send a secure link — your scaffolders upload their own CISRS card, insurance and RAMS straight from their phone.' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <HardHat className="w-5 h-5 text-amber-400" />
            ScaffKeep
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => navigate('/login')}>Log in</Button>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold" onClick={() => navigate('/register')}>Start free trial</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              One lapsed CISRS card can shut your scaffold down.{' '}
              <span className="text-amber-400">Know before it does.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Compliance tracking built for scaffolding contractors — every operative's CISRS card, public liability, employer's liability and RAMS in one place, with automatic alerts before anything expires and a one-tap report the moment the main contractor or HSE asks.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base h-12 px-8"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}>
                Start free trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-slate-400 sm:ml-2">
                <Check className="w-4 h-4 text-green-400" /> 7-day free trial
                <span className="mx-1">·</span>
                <Check className="w-4 h-4 text-green-400" /> No setup fee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Simple, honest pricing</h2>
          <p className="text-center text-slate-400 mb-10">7-day free trial. No setup fee. Cancel anytime.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`rounded-2xl p-6 border-2 ${plan.highlight ? 'border-amber-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}>
                {plan.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold mb-3">{plan.badge}</span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.priceLabel}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
                <Button className={`w-full mt-6 h-11 font-semibold ${plan.highlight ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
                  onClick={() => navigate(isAuthenticated ? '/settings' : '/register')}>
                  Start free trial
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <HardHat className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">ScaffKeep</span>
          </div>
          <p className="text-xs text-slate-500">Compliance tracking for UK scaffolding contractors</p>
        </div>
      </footer>
    </div>
  );
}