import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import Logo from './Logo';
import ImageCarousel from './ImageCarousel';
import { hero } from '@/content/site';
import { REGISTRATION_ENABLED, REGISTRATION_EMAIL, COMING_SOON } from '@/lib/site-config';

export default function Hero() {
  // Background carousel — local imagery.
  const carouselImages: Array<{ url: string; alt: string }> = [
    { url: '/images/home/HomePage1.jpeg', alt: 'Formula Hellas at the Serres Racing Circuit' },
    { url: '/images/home/HomePage2.jpeg', alt: 'Formula Hellas at the Serres Racing Circuit' },
  ];

  return (
    <section className="relative bg-gradient-hero text-white min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {carouselImages.length > 0 ? (
          <div className="relative w-full h-full opacity-40">
            <ImageCarousel
              images={carouselImages}
              autoPlay={true}
              interval={6000}
              className="h-full"
              height="h-full"
            />
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 z-0"></div>

      {/* Racing stripe accent */}
      <div className="absolute inset-0 racing-stripe opacity-10 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="text-center animate-fade-in-up opacity-95">
          <div className="mb-8 flex justify-center transform hover:scale-105 transition-transform duration-300">
            <Logo height={100} />
          </div>

          <span className="inline-block mb-5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Inaugural edition · 2026
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            {hero.heading}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            {hero.tagline}
          </p>

          {/* Key facts */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10 text-sm sm:text-base">
            <span className="inline-flex items-center gap-2 font-semibold">
              <CalendarDays className="w-5 h-5 text-white/80" />
              {hero.keyFacts[0].value}
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <MapPin className="w-5 h-5 text-white/80" />
              {hero.keyFacts[1].value}
            </span>
          </div>

          {/* Primary CTA — Register. Disabled until a registration email is set. */}
          <div className="flex flex-col items-center gap-3">
            {REGISTRATION_ENABLED && REGISTRATION_EMAIL ? (
              <a
                href={`mailto:${REGISTRATION_EMAIL}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl text-lg"
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
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/30 text-white/80 font-bold rounded-xl cursor-not-allowed shadow-xl text-lg"
              >
                Register — {COMING_SOON}
              </button>
            )}
            <p className="text-sm text-gray-200">{hero.registrationNotice}</p>
            <Link
              href="/registration"
              className="text-sm font-semibold text-white underline underline-offset-4 hover:text-gray-200 transition-colors"
            >
              Registration & eligibility details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
