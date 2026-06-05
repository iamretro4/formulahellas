'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Mail, ExternalLink } from 'lucide-react';
import {
  SITE_NAME,
  CONTACT_EMAIL,
  TECHNICAL_EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  VENUE_NAME,
  VENUE_URL,
  COMING_SOON,
} from '@/lib/site-config';

const footerDescription =
  'A new Formula Student competition, part of the Formula Student World Competition Series, hosted at the Serres Racing Circuit in Northern Greece.';

const quickLinks = [
  { label: 'Competition', url: '/events/2026' },
  { label: 'About', url: '/about' },
  { label: 'Registration', url: '/registration' },
  { label: 'Rules & Documents', url: '/rules' },
  { label: 'Contact', url: '/contact' },
];

const joinUsLinks = [
  { label: 'Become a Judge', url: '/join-us' },
  { label: 'Become a Scrutineer', url: '/join-us' },
  { label: 'Become a Volunteer', url: '/join-us' },
];

export default function FooterClient() {
  const contactEmails = Array.from(new Set([CONTACT_EMAIL, TECHNICAL_EMAIL].filter(Boolean))) as string[];

  return (
    <footer className="bg-ink text-gray-300 border-t border-white/10 relative overflow-hidden">
      {/* Brand top edge + grid texture */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-blue via-primary-blue-light to-flame" aria-hidden />
      <div className="absolute inset-0 grid-lines opacity-[0.35]" aria-hidden></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div>
            <div className="inline-flex items-center rounded-xl bg-white px-3 py-2 mb-5 shadow-sm">
              <Image src="/images/brand/fh-mark.png" alt={SITE_NAME} width={104} height={50} className="h-8 w-auto" />
            </div>
            <p className="text-sm mb-6 leading-relaxed">{footerDescription}</p>
            <div className="flex gap-4">
              {INSTAGRAM_URL ? (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-white/5 ring-1 ring-white/5 flex items-center justify-center text-gray-400 transition-all hover:text-white hover:bg-primary-blue hover:ring-primary-blue/40 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(45,77,245,0.5)]"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              ) : (
                <span
                  className="w-10 h-10 rounded-md bg-white/5 ring-1 ring-white/5 flex items-center justify-center text-gray-600 cursor-not-allowed"
                  aria-disabled="true"
                  title={`Instagram — ${COMING_SOON}`}
                  aria-label={`Instagram — ${COMING_SOON}`}
                >
                  <Instagram className="w-5 h-5" />
                </span>
              )}
              {LINKEDIN_URL ? (
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-white/5 ring-1 ring-white/5 flex items-center justify-center text-gray-400 transition-all hover:text-white hover:bg-primary-blue hover:ring-primary-blue/40 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(45,77,245,0.5)]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              ) : (
                <span
                  className="w-10 h-10 rounded-md bg-white/5 ring-1 ring-white/5 flex items-center justify-center text-gray-600 cursor-not-allowed"
                  aria-disabled="true"
                  title={`LinkedIn — ${COMING_SOON}`}
                  aria-label={`LinkedIn — ${COMING_SOON}`}
                >
                  <Linkedin className="w-5 h-5" />
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.url + link.label}>
                  <Link href={link.url} className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Join Us</h3>
            <ul className="space-y-3 text-sm">
              {joinUsLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.url} className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              {contactEmails.length > 0 ? (
                contactEmails.map((email) => (
                  <li key={email}>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 hover:text-white transition-all group"
                    >
                      <Mail className="w-4 h-4 text-primary-blue group-hover:translate-x-0.5 transition-transform" />
                      <span>{email}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-4 h-4 text-primary-blue" />
                  <span>{COMING_SOON}</span>
                </li>
              )}
              <li>
                <a
                  href={VENUE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-primary-blue" />
                  <span>{VENUE_NAME}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
