import { generateMetadata as generateSEOMetadata, generateBreadcrumbStructuredData } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CheckCircle2, Tent, Warehouse, Flag } from 'lucide-react';
import { about } from '@/content/site';
import { SITE_URL } from '@/lib/site-config';

export const metadata = generateSEOMetadata({
  title: 'About',
  description:
    'About Formula Hellas — a new Formula Student competition hosted at the Serres Racing Circuit. Our mission, the 2026 classes, and the venue.',
  url: '/about',
});

const facilityIcons = [Warehouse, Tent, Flag];

export default function AboutPage() {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'About', url: `${SITE_URL}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs items={[{ label: 'About' }]} className="mb-6" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{about.title}</h1>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg mb-10">{about.intro}</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{about.whatIs.heading}</h2>
              <p className="mb-8">{about.whatIs.body}</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{about.mission.heading}</h2>
              <p className="mb-8">{about.mission.body}</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{about.organisers.heading}</h2>
              <p className="mb-2">{about.organisers.body}</p>
            </div>
          </div>

          {/* Classes */}
          <section id="classes" className="max-w-4xl mx-auto mt-16 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{about.classes.heading}</h2>
            <p className="text-gray-600 mb-8">{about.classes.intro}</p>
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
          <section id="venue" className="max-w-4xl mx-auto mt-16 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{about.venue.heading}</h2>
            <p className="text-gray-700 leading-relaxed mb-8">{about.venue.body}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {about.venue.facilities.map((facility, i) => {
                const Icon = facilityIcons[i % facilityIcons.length];
                return (
                  <div key={facility.title} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-blue" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{facility.title}</h3>
                    <p className="text-gray-600 text-sm">{facility.body}</p>
                  </div>
                );
              })}
            </div>
            <ul className="mt-8 space-y-2">
              {[
                'Largest racing circuit in the Balkans',
                'Only FIA- and FIM-accredited motorsport facility in Greece',
                'Operating since 1998',
                'Built to safety standards for racing up to Formula 3',
              ].map((fact) => (
                <li key={fact} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
