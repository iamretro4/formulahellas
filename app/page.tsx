import Hero from '@/components/Hero';
import NewsSection from '@/components/NewsSection';
import DocumentCard from '@/components/DocumentCard';
import Reveal from '@/components/Reveal';
import { getFeaturedNews, getDocuments } from '@/lib/sanity.queries';
import Link from 'next/link';
import { ArrowRight, FileText, Users, Mail, ClipboardList, Layers, Flag, Sparkles } from 'lucide-react';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { generateStructuredData } from '@/lib/seo';
import { home } from '@/content/site';

export const revalidate = 60;

export const metadata = generateSEOMetadata({
  title: 'Home',
  description:
    'Formula Hellas — a new Formula Student competition hosted at the Serres Racing Circuit in Northern Greece. The first edition runs 02–07 August 2026.',
  url: '/',
});

const highlightIcons = [Layers, Flag, Sparkles];

const quickLinks = [
  { href: '/about', title: 'About', desc: 'Classes, venue and our mission', Icon: FileText },
  { href: '/registration', title: 'Registration', desc: 'Registration and team slots', Icon: ClipboardList },
  { href: '/join-us', title: 'Join Us', desc: 'Become a judge or volunteer', Icon: Users },
  { href: '/contact', title: 'Contact', desc: 'Get in touch with us', Icon: Mail },
];

export default async function Home() {
  const featuredNews = await getFeaturedNews().catch(() => []);
  const featuredDocs = await getDocuments()
    .then((docs) =>
      docs
        .filter((doc: any) => doc.isFeatured)
        .filter(
          (doc: any) =>
            doc.category !== 'handbook' && doc.category !== 'event-handbook' && doc.category !== 'results'
        )
        .slice(0, 3)
    )
    .catch(() => []);

  const eventStructuredData = generateStructuredData({
    type: 'Event',
    data: {
      name: 'Formula Hellas 2026',
      description: 'The first Formula Hellas: a Formula Student competition at the Serres Racing Circuit, Northern Greece.',
      startDate: '2026-08-02',
      endDate: '2026-08-07',
      locationName: 'Serres Racing Circuit',
      addressLocality: 'Serres',
      eventStatus: 'https://schema.org/EventScheduled',
    },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }} />
      <div className="flex flex-col">
        <Hero />

        {/* Intro */}
        <section className="section bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl mx-auto text-center">
              <span className="eyebrow justify-center">01 — The Competition</span>
              <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                {home.intro.heading}
              </h2>
              <div className="mx-auto mt-5 rule-accent" />
              <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">{home.intro.body}</p>
            </Reveal>
          </div>
        </section>

        {/* Highlights — dark engineering band */}
        <section className="section bg-ink text-white relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-40" aria-hidden />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <span className="eyebrow eyebrow-light">02 — Why Formula Hellas</span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white max-w-2xl">
                Built for engineers, by engineers.
              </h2>
              <div className="mt-5 rule-accent" />
            </Reveal>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
              {home.highlights.map((item, i) => {
                const Icon = highlightIcons[i % highlightIcons.length];
                return (
                  <Reveal key={item.title} delay={i * 90}>
                    <div className="group h-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-7 transition-all duration-300 ease-out hover:bg-white/[0.08] hover:border-primary-blue/40 hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-primary-blue/15 ring-1 ring-primary-blue/30 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-300" />
                        </div>
                        <span className="font-mono text-sm text-white/30">0{i + 1}</span>
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
                      <p className="mt-2 text-white/60 leading-relaxed">{item.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Documents (optional, from CMS) */}
        {featuredDocs.length > 0 ? (
          <section className="section bg-paper">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div>
                  <span className="eyebrow">Documents</span>
                  <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-gray-900">Featured documents</h2>
                </div>
                <Link
                  href="/rules"
                  className="inline-flex items-center gap-2 text-primary-blue-dark font-semibold transition-colors group"
                >
                  View all
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredDocs.map((doc: any) => (
                  <DocumentCard key={doc._id} document={doc} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* News (optional, from CMS) */}
        <NewsSection news={featuredNews.length > 0 ? featuredNews : []} />

        {/* Quick Links */}
        <section className="section bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center max-w-2xl mx-auto">
              <span className="eyebrow justify-center">Explore</span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-gray-900">Start here</h2>
              <p className="mt-3 text-gray-500">Everything you need to take part in the first edition.</p>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickLinks.map((l, i) => (
                <Reveal key={l.href} delay={i * 70}>
                  <Link
                    href={l.href}
                    className="group relative block h-full rounded-2xl bg-white border border-gray-200/80 shadow-sm p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-elev-3 hover:border-primary-blue/40"
                  >
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="w-12 h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
                      <l.Icon className="w-6 h-6 text-primary-blue" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-blue-dark transition-colors">
                      {l.title}
                    </h3>
                    <p className="mt-1 text-gray-500 text-sm">{l.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-primary-blue-dark text-sm font-semibold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      Open
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
