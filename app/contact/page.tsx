'use client';

import { useState } from 'react';
import { Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  CONTACT_EMAIL,
  TECHNICAL_EMAIL,
  REGISTRATION_EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  VENUE_NAME,
  VENUE_URL,
  COMING_SOON,
} from '@/lib/site-config';

/**
 * Contact Form
 *
 * Form submissions are stored in Supabase in the 'contact_submissions' table.
 * To view submissions, access your Supabase dashboard and query that table.
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      ]);

      if (error) {
        setSubmitStatus('error');
      } else {
        try {
          await fetch('/api/send-form-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formType: 'contact',
              formData: {
                Name: formData.name,
                Email: formData.email,
                Subject: formData.subject,
                Message: formData.message,
              },
            }),
          });
        } catch {
          // Don't fail the form submission if email fails
        }

        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const emailChannels: Array<{ label: string; value: string | null }> = [
    { label: 'General inquiries', value: CONTACT_EMAIL },
    { label: 'Technical inquiries', value: TECHNICAL_EMAIL },
    { label: 'Registration', value: REGISTRATION_EMAIL },
  ];

  const socials: Array<{ label: string; url: string | null; Icon: typeof Instagram }> = [
    { label: 'Instagram', url: INSTAGRAM_URL, Icon: Instagram },
    { label: 'LinkedIn', url: LINKEDIN_URL, Icon: Linkedin },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
        <p className="text-lg text-gray-600 mb-12">
          Have questions about Formula Hellas? Send us a message, or use the channels below. Some
          contact details are being finalised and are marked &ldquo;{COMING_SOON}&rdquo;.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="registration">Team Registration</option>
                  <option value="judge">Become a Judge</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="technical">Technical Question</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-primary-blue-dark transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  Thank you! Your message has been sent. We&apos;ll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  Something went wrong. Please try again or contact us directly via email.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Email</h3>
                <ul className="space-y-2">
                  {emailChannels.map((channel) => (
                    <li key={channel.label} className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-gray-700 w-40 shrink-0">{channel.label}:</span>
                      {channel.value ? (
                        <a href={`mailto:${channel.value}`} className="text-blue-600 hover:text-blue-700">
                          {channel.value}
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">{COMING_SOON}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
                <div className="flex items-center gap-4">
                  {socials.map(({ label, url, Icon }) =>
                    url ? (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label={label}
                      >
                        <Icon className="w-6 h-6" />
                      </a>
                    ) : (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 text-gray-400 cursor-not-allowed"
                        aria-disabled="true"
                        title={COMING_SOON}
                        aria-label={`${label} — ${COMING_SOON}`}
                      >
                        <Icon className="w-6 h-6" />
                      </span>
                    )
                  )}
                  <span className="text-sm text-gray-500 italic">{COMING_SOON}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue &amp; Organiser</h3>
                <a
                  href={VENUE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  {VENUE_NAME} — serrescircuit.gr
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
