import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarDays, MapPin, CheckCircle2, ArrowRight, CalendarClock } from 'lucide-react';
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import { about, registration } from '@/content/site';
import {
  COMPETITION_DATES,
  COMPETITION_LOCATION,
  REGISTRATION_OPENS,
  SITE_URL,
} from '@/lib/site-config';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Formula Hellas 2026',
  description:
    'The first Formula Hellas: a Formula Student competition at the Serres Racing Circuit, Northern Greece, 02–07 August 2026. Two classes (CV and EV), 12 slots each.',
  url: '/events/2026',
});

// The 2026 competition is the only edition. Any other year is not found.
export default async function EventPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  if (year !== '2026') {
    notFound();
  }

  const eventStructuredData = generateStructuredData({
    type: 'Event',
    data: {
      name: 'Formula Hellas 2026',
      description:
        'The first Formula Hellas: a Formula Student competition at the Serres Racing Circuit, Northern Greece.',
      startDate: '2026-08-02',
      endDate: '2026-08-07',
      locationName: 'Serres Racing Circuit',
      addressLocality: 'Serres',
      eventStatus: 'https://schema.org/EventScheduled',
    },
  });

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Formula Hellas 2026', item: `${SITE_URL}/events/2026` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-sm font-semibold">
            First edition
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Formula Hellas 2026</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-700 mb-10">
            <span className="inline-flex items-center gap-2 font-semibold">
              <CalendarDays className="w-5 h-5 text-primary-blue" />
              {COMPETITION_DATES}
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <MapPin className="w-5 h-5 text-primary-blue" />
              {COMPETITION_LOCATION}
            </span>
          </div>

          <p className="text-lg text-gray-700 mb-12">{about.intro}</p>

          {/* Classes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{about.classes.heading}</h2>
            <p className="text-gray-600 mb-6">{about.classes.intro}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.classes.items.map((cls) => (
                <div key={cls.name} className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-6">
                  <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-sm font-semibold">
                    {cls.slots}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{cls.name}</h3>
                  <p className="text-gray-600 text-sm">{cls.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm font-medium text-gray-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              {about.classes.note}
            </p>
          </section>

          {/* Venue */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{about.venue.heading}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{about.venue.body}</p>
            <ul className="space-y-2">
              {about.venue.facilities.map((facility) => (
                <li key={facility.title} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">{facility.title}.</span> {facility.body}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Registration */}
          <section className="mb-12 bg-primary-blue/5 border-2 border-primary-blue/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CalendarClock className="w-6 h-6 text-primary-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Registration</h2>
            </div>
            <p className="text-gray-700 mb-2">{registration.intro}</p>
            <p className="text-gray-700 font-medium mb-5">Registration opens {REGISTRATION_OPENS}.</p>
            <Link
              href="/registration"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white font-bold rounded-xl hover:bg-primary-blue-dark transition-all transform hover:scale-105 shadow-lg"
            >
              Registration
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>

          {/* Schedule placeholder */}
          <section className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule</h2>
            <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-10 text-center">
              <p className="text-gray-600">The detailed event schedule will be published here. Coming soon.</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
