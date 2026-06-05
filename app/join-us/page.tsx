import { getPageContent } from '@/lib/sanity.queries';
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { joinUs } from '@/content/site';
import Link from 'next/link';
import { APPLICATIONS_ENABLED, COMING_SOON } from '@/lib/site-config';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export const metadata = generateSEOMetadata({
  title: "Join Us",
  description: "Become a judge, scrutineer, or volunteer for Formula Hellas. Help us bring the first edition to life.",
  url: "/join-us",
});

export default async function JoinUsPage() {
  const pageContent = await getPageContent('join-us').catch(() => null);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <span className="eyebrow">Get involved</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {pageContent?.title || joinUs.title}
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          {joinUs.intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Judge */}
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 card-hover group">
            <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
              <svg
                className="w-8 h-8 text-primary-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-blue transition-colors">Become a Judge</h2>
            <p className="text-gray-600 mb-6">
              Judges evaluate teams on design, cost, and business presentation. Bring your
              experience and give students feedback they&apos;ll actually use.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• Evaluate vehicle design and engineering</li>
              <li>• Assess business case presentations</li>
              <li>• Provide feedback to student teams</li>
              <li>• Network with industry professionals</li>
            </ul>
            {APPLICATIONS_ENABLED ? (
              <Link
                href="/apply/judge"
                className="inline-block px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-sm"
              >
                Apply Now
              </Link>
            ) : (
              <button
                disabled
                className="inline-block px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed text-sm"
              >
                Apply ({COMING_SOON})
              </button>
            )}
          </div>

          {/* Scrutineer */}
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 card-hover group">
            <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
              <svg
                className="w-8 h-8 text-primary-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-blue transition-colors">Become a Scrutineer</h2>
            <p className="text-gray-600 mb-6">
              Scrutineers ensure all vehicles meet safety and technical regulations. Your 
              attention to detail keeps the competition safe and fair.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• Inspect vehicles for compliance</li>
              <li>• Verify safety regulations</li>
              <li>• Ensure fair competition</li>
              <li>• Work closely with technical teams</li>
            </ul>
            {APPLICATIONS_ENABLED ? (
              <Link
                href="/apply/scrutineer"
                className="inline-block px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-sm"
              >
                Apply Now
              </Link>
            ) : (
              <button
                disabled
                className="inline-block px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed text-sm"
              >
                Apply ({COMING_SOON})
              </button>
            )}
          </div>

          {/* Volunteer */}
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 card-hover group">
            <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
              <svg
                className="w-8 h-8 text-primary-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-blue transition-colors">Become a Volunteer</h2>
            <p className="text-gray-600 mb-6">
              Volunteers are essential to the smooth operation of the event. Help with 
              logistics, registration, and event coordination.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• Assist with event logistics</li>
              <li>• Help with registration and check-in</li>
              <li>• Support teams and visitors</li>
              <li>• Gain valuable event experience</li>
            </ul>
            {APPLICATIONS_ENABLED ? (
              <Link
                href="/apply/volunteer"
                className="inline-block px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-sm"
              >
                Apply Now
              </Link>
            ) : (
              <button
                disabled
                className="inline-block px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed text-sm"
              >
                Apply ({COMING_SOON})
              </button>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Join Formula Hellas?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Professional Development</h3>
              <p className="text-sm">
                You&apos;ll work next to experienced engineers and sharp student teams, good people to know in this field.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Make a Difference</h3>
              <p className="text-sm">
                Your feedback is often what a team actually takes away and builds on. That&apos;s the part that sticks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Exciting Environment</h3>
              <p className="text-sm">
                Real cars, real engineering, on a proper motorsport circuit. A good weekend to be part of.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm">
                Engineers, academics and motorsport people who genuinely care about this, the kind of crowd that makes a paddock worth being in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

