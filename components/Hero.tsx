import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import Badge from './ui/Badge';
import { hero } from '@/content/site';
import { REGISTRATION_ENABLED, REGISTRATION_EMAIL, COMING_SOON } from '@/lib/site-config';

const stats: Array<[string, string]> = [
  ['02–07', 'Aug · race week'],
  ['12 + 12', 'EV & CV slots'],
  ['#1', 'Circuit in the Balkans'],
  ['’26', 'First edition'],
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Light brand mesh + technical grid */}
      <div className="absolute inset-0 hero-mesh-light" aria-hidden />
      <div className="absolute inset-0 grid-lines-ink" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 sm:pt-20 sm:pb-16 text-center">
        <h1 className="sr-only">Formula Hellas</h1>

        <div className="mb-8 flex justify-center animate-fade-in-down">
          <Badge variant="soft">First edition · 2026</Badge>
        </div>

        {/* The logo, front and centre */}
        <div className="flex justify-center animate-scale-in">
          <Image
            src="/images/brand/fh-logo.png"
            alt="Formula Hellas — Serres Racing Circuit"
            width={1200}
            height={348}
            className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl h-auto"
            priority
          />
        </div>

        <p className="mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          {hero.tagline}
        </p>

        {/* Key facts */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-700">
          <span className="inline-flex items-center gap-2 font-semibold">
            <CalendarDays className="w-5 h-5 text-primary-blue" />
            {hero.keyFacts[0].value}
          </span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
          <span className="inline-flex items-center gap-2 font-semibold">
            <MapPin className="w-5 h-5 text-primary-blue" />
            {hero.keyFacts[1].value}
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {REGISTRATION_ENABLED && REGISTRATION_EMAIL ? (
            <a
              href={`mailto:${REGISTRATION_EMAIL}?subject=Formula%20Hellas%202026%20Team%20Registration&body=Dear%20Formula%20Hellas%20Organizers%2C%0A%0AWe%20would%20like%20to%20register%20our%20team%20for%20Formula%20Hellas%202026.%20Below%20are%20our%20details%3A%0A%0A1.%20Team%20Name%3A%20%0A2.%20University%3A%20%0A3.%20Class%20(EV%20or%20CV)%3A%20%0A4.%20Team%20Captain%20Full%20Name%3A%20%0A5.%20Team%20Captain%20Phone%20Number%3A%20%0A%0AThank%20you!`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary-blue text-white font-bold shadow-glow-blue ring-1 ring-inset ring-white/15 hover:-translate-y-0.5 transition-transform"
            >
              Register
              <ArrowRight className="w-5 h-5" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              title={COMING_SOON}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gray-200 text-gray-500 font-bold cursor-not-allowed"
            >
              Register ({COMING_SOON})
            </button>
          )}
          <Link
            href="/registration"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:border-primary-blue hover:text-primary-blue-dark hover:bg-primary-blue/5 transition-colors"
          >
            Registration &amp; eligibility
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">{hero.registrationNotice}</p>
      </div>

      {/* Dark stat band — grounds the hero with contrast */}
      <div className="relative z-10 bg-ink text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-blue to-transparent" aria-hidden />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
          {stats.map(([n, l]) => (
            <div key={l} className="px-3 text-center">
              <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums tracking-tight text-white">{n}</div>
              <div className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-wider text-white/55">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
