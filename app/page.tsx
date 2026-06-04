import Hero from '@/components/Hero';
import NewsSection from '@/components/NewsSection';
import DocumentCard from '@/components/DocumentCard';
import { getFeaturedNews, getDocuments } from '@/lib/sanity.queries';
import Link from 'next/link';
import { ArrowRight, FileText, Users, Mail, ClipboardList } from 'lucide-react';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { generateStructuredData } from '@/lib/seo';
import { home } from '@/content/site';

export const revalidate = 60;

export const metadata = generateSEOMetadata({
  title: 'Home',
  description:
    'Formula Hellas — a new Formula Student competition hosted at the Serres Racing Circuit in Northern Greece. The inaugural edition runs 02–07 August 2026.',
  url: '/',
});

export default async function Home() {
  // Optional CMS content — sections hide themselves when empty.
  const featuredNews = await getFeaturedNews().catch(() => []);
  const featuredDocs = await getDocuments()
    .then((docs) =>
      docs
        .filter((doc: any) => doc.isFeatured)
        .filter(
          (doc: any) =>
            doc.category !== 'handbook' &&
            doc.category !== 'event-handbook' &&
            doc.category !== 'results'
        )
        .slice(0, 3)
    )
    .catch(() => []);

  // Static structured data for the inaugural 2026 competition.
  const eventStructuredData = generateStructuredData({
    type: 'Event',
    data: {
      name: 'Formula Hellas 2026',
      description:
        'The inaugural Formula Hellas — a Formula Student competition at the Serres Racing Circuit, Northern Greece.',
      startDate: '2026-08-02',
      endDate: '2026-08-07',
      locationName: 'Serres Racing Circuit',
      addressLocality: 'Serres',
      eventStatus: 'https://schema.org/EventScheduled',
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
      />
      <div className="flex flex-col">
        <Hero />

        {/* Competition Intro */}
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                {home.intro.heading}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed px-4">
                {home.intro.body}
              </p>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {home.highlights.map((item) => (
                <div
                  key={item.title}
                  className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Documents (optional, from CMS) */}
        {featuredDocs.length > 0 ? (
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Featured Documents</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Important competition documents and resources</p>
                </div>
                <Link
                  href="/rules"
                  className="text-primary-blue hover:text-primary-blue-dark font-semibold text-base transition-all flex items-center gap-2 group"
                >
                  View All
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredDocs.map((doc: any) => (
                  <DocumentCard key={doc._id} document={doc} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* News Section (optional, from CMS) */}
        <NewsSection news={featuredNews.length > 0 ? featuredNews : []} />

        {/* Quick Links */}
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Link
                href="/about"
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
              >
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">About</h3>
                <p className="text-gray-600 text-base">Classes, venue and our mission</p>
              </Link>
              <Link
                href="/registration"
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
              >
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                  <ClipboardList className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">Registration</h3>
                <p className="text-gray-600 text-base">Eligibility, slots and fees</p>
              </Link>
              <Link
                href="/join-us"
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
              >
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                  <Users className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">Join Us</h3>
                <p className="text-gray-600 text-base">Become a judge or volunteer</p>
              </Link>
              <Link
                href="/contact"
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
              >
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                  <Mail className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">Contact</h3>
                <p className="text-gray-600 text-base">Get in touch with us</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
