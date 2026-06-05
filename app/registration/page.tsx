import { generateMetadata as generateSEOMetadata, generateBreadcrumbStructuredData } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CalendarClock, Mail, FileCheck2 } from 'lucide-react';
import { registration } from '@/content/site';
import { REGISTRATION_EMAIL, COMING_SOON, SITE_URL } from '@/lib/site-config';
import RegisterButton from '@/components/RegisterButton';

export const metadata = generateSEOMetadata({
  title: 'Registration',
  description:
    'How to register for Formula Hellas 2026: the first-come first-served slots, the registration window, and the Formula Hellas Hub.',
  url: '/registration',
});

export default function RegistrationPage() {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Registration', url: `${SITE_URL}/registration` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Breadcrumbs items={[{ label: 'Registration' }]} className="mb-6" />
          <span className="eyebrow">Take part</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{registration.title}</h1>
          <p className="text-lg text-gray-700 mb-10">{registration.intro}</p>

          {/* Registration window */}
          <section className="mb-12 bg-primary-blue/5 border-2 border-primary-blue/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarClock className="w-6 h-6 text-primary-blue" />
              <h2 className="text-xl font-bold text-gray-900">{registration.window.heading}</h2>
            </div>
            <dl className="space-y-2 text-gray-700">
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <dt className="font-semibold w-28 shrink-0">Opens</dt>
                <dd>{registration.window.opens}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <dt className="font-semibold w-28 shrink-0">Closes</dt>
                <dd>{registration.window.closes}</dd>
              </div>
            </dl>
          </section>



          {/* How to register */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{registration.howTo.heading}</h2>
            <ol className="space-y-4">
              {registration.howTo.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-blue text-white font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>

            {/* Register CTA — disabled until REGISTRATION_EMAIL is set. */}
            <div className="mt-8 bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 text-center">
              {REGISTRATION_EMAIL ? (
                <RegisterButton
                  email={REGISTRATION_EMAIL}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-blue text-white font-bold rounded-xl hover:bg-primary-blue-dark transition-all transform hover:scale-105 shadow-lg"
                />
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title={COMING_SOON}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-300 text-gray-600 font-bold rounded-xl cursor-not-allowed shadow"
                >
                  <Mail className="w-5 h-5" />
                  Register ({COMING_SOON})
                </button>
              )}
              <p className="mt-3 text-sm text-gray-600">
                Registration email: <span className="font-semibold">{REGISTRATION_EMAIL ?? COMING_SOON}</span>
              </p>
            </div>
          </section>

          {/* After securing a slot — the Hub */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <FileCheck2 className="w-6 h-6 text-primary-blue" />
              <h2 className="text-2xl font-semibold text-gray-900">{registration.hub.heading}</h2>
            </div>
            <p className="text-gray-700 mb-4">{registration.hub.body}</p>
            <p className="text-gray-700 font-medium mb-3">Account setup requires:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {registration.hub.accountFields.map((field) => (
                <li key={field} className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
                  {field}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
