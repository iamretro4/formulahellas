'use client';

import Link from 'next/link';
import { CONTACT_EMAIL, COMING_SOON, APPLY_JUDGE_URL } from '@/lib/site-config';
import { Mail } from 'lucide-react';

export default function JudgeApplicationPage() {
  const emailSubject = encodeURIComponent('Formula Hellas 2026 Judge Application');
  const emailBody = encodeURIComponent(
    `Dear Formula Hellas Organizers,\n\nI would like to apply to become a Judge for Formula Hellas 2026. Below are my details:\n\n1. Full Name: \n2. Phone Number: \n3. Preferred Area (e.g. Design, Cost & Manufacturing, Business Plan Presentation): \n4. Relevant Experience/Engineering Background: \n\nThank you!`
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Link href="/join-us" className="text-[#2D4DF5] hover:text-[#1E34CC] mb-8 inline-block font-bold">
          &larr; Back to Join Us
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Become a Judge</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8">
          {APPLY_JUDGE_URL ? (
            <>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Apply via Google Form</h2>
              <p className="text-lg text-blue-800 mb-8">
                Applications are handled through our Google Form. Use the button below to apply.
              </p>
              
              <a
                href={APPLY_JUDGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-[#2D4DF5] text-white font-bold rounded-xl hover:bg-[#1E34CC] transition-all transform hover:scale-105 shadow-xl text-lg"
              >
                Open Google Form
              </a>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Apply by Email</h2>
              <p className="text-lg text-blue-800 mb-8">
                Send us an email with your application details using the template below.
              </p>
              
              {CONTACT_EMAIL ? (
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#2D4DF5] text-white font-bold rounded-xl hover:bg-[#1E34CC] transition-all transform hover:scale-105 shadow-xl text-lg"
                >
                  <Mail className="w-5 h-5" />
                  Apply by email
                </a>
              ) : (
                <button
                  disabled
                  className="inline-block px-8 py-4 bg-gray-300 text-gray-500 font-bold rounded-xl cursor-not-allowed shadow text-lg"
                >
                  Apply ({COMING_SOON})
                </button>
              )}
            </>
          )}
        </div>

        <p className="text-gray-600">
          If you have any questions, please contact us at{' '}
          {CONTACT_EMAIL ? (
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2D4DF5] underline">{CONTACT_EMAIL}</a>
          ) : (
            <span className="font-semibold">{COMING_SOON}</span>
          )}
        </p>
      </div>
    </div>
  );
}
