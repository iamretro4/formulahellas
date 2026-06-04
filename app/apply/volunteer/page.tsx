'use client';

import Link from 'next/link';
import { CONTACT_EMAIL, COMING_SOON } from '@/lib/site-config';

export default function VolunteerApplicationPage() {
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc_eblYXqoTzIVO97QBgw2nuH4dPXOwAuAnq__W4zNfhNAUGw/viewform?usp=dialog";

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Link href="/join-us" className="text-[#0066FF] hover:text-[#0052CC] mb-8 inline-block font-bold">
          &larr; Back to Join Us
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Become a Volunteer</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Form has moved</h2>
          <p className="text-lg text-blue-800 mb-8">
            Our application system is currently undergoing maintenance. 
            Please use our Google Form to submit your application.
          </p>
          
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-[#0066FF] text-white font-bold rounded-xl hover:bg-[#0052CC] transition-all transform hover:scale-105 shadow-xl text-lg"
          >
            Open Google Form
          </a>
        </div>

        <p className="text-gray-600">
          If you have any questions, please contact us at{' '}
          {CONTACT_EMAIL ? (
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0066FF] underline">{CONTACT_EMAIL}</a>
          ) : (
            <span className="font-semibold">{COMING_SOON}</span>
          )}
        </p>
      </div>
    </div>
  );
}
