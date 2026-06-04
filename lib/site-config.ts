/**
 * Formula Hellas — central site configuration.
 *
 * This is the ONE place to fill in contact details, social links and the
 * production domain. Anything set to `null` renders as "Coming soon" in the UI
 * and its button / link is disabled. To go live, replace a `null` with a real
 * value (e.g. `export const CONTACT_EMAIL = 'info@example.com';`).
 *
 * Do NOT invent values — leave them `null` until the real one is known.
 */

export const SITE_NAME = 'Formula Hellas';

export const SITE_TAGLINE =
  'Built by Formula Student alumni. Hosted at the largest circuit in the Balkans.';

export const SITE_DESCRIPTION =
  'Formula Hellas is a new Formula Student competition, part of the Formula Student World Competition Series, hosted at the Serres Racing Circuit in Northern Greece. The inaugural edition runs 02–07 August 2026.';

/**
 * Production domain — used only for canonical URLs, the sitemap and
 * structured data. Override per-environment with NEXT_PUBLIC_SITE_URL.
 * TODO: confirm the final production domain before launch.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://formulahellas.gr';

/* -------------------------------------------------------------------------- */
/*  Contact emails — set a string to enable, leave null for "Coming soon".    */
/* -------------------------------------------------------------------------- */

/** General inquiries. */
export const CONTACT_EMAIL: string | null = null;
/** Technical inquiries. */
export const TECHNICAL_EMAIL: string | null = null;
/** Team registration (team captains email this to register). */
export const REGISTRATION_EMAIL: string | null = null;
/** Billing / payment / invoice questions. */
export const INFO_EMAIL: string | null = null;

/* -------------------------------------------------------------------------- */
/*  Social links — set a URL to enable, leave null for "Coming soon".         */
/* -------------------------------------------------------------------------- */

export const INSTAGRAM_URL: string | null = null;
export const LINKEDIN_URL: string | null = null;
export const FACEBOOK_URL: string | null = null;

/* -------------------------------------------------------------------------- */
/*  Venue & organiser (public, confirmed).                                    */
/* -------------------------------------------------------------------------- */

export const VENUE_NAME = 'Serres Racing Circuit';
/** Real, live link for the venue & organiser. */
export const VENUE_URL = 'https://serrescircuit.gr';

/**
 * External "Formula Hellas Hub" portal where registered teams manage their
 * profile, uploads and inspections. Leave null until the Hub URL is known
 * (renders the Team Portal login as "Coming soon").
 */
export const TEAM_PORTAL_URL: string | null = null;

/* -------------------------------------------------------------------------- */
/*  Key dates (display strings use DD-MM-YYYY per the brand guidelines).      */
/* -------------------------------------------------------------------------- */

export const COMPETITION_DATES = '02-08-2026 – 07-08-2026';
export const COMPETITION_DATES_LONG = '02–07 August 2026';
export const COMPETITION_LOCATION = 'Serres Racing Circuit, Northern Greece';

/** Registration window. The Register CTA stays disabled until REGISTRATION_EMAIL is set. */
export const REGISTRATION_OPENS = '05-06-2026, 13:00 Athens time';
export const REGISTRATION_CLOSES = 'when slots fill, no later than 13-06-2026';

/* -------------------------------------------------------------------------- */
/*  Transactional email infrastructure (Resend).                              */
/*  These are SENDER/technical addresses, not public contact addresses.       */
/*  Set them via env once the Formula Hellas sending domain is verified in     */
/*  Resend. The defaults use the placeholder domain — update before launch.   */
/* -------------------------------------------------------------------------- */

export const EMAIL_FROM_QUIZ =
  process.env.FROM_EMAIL || 'Formula Hellas <noreply@formulahellas.gr>';
export const EMAIL_FROM_NOTIFICATIONS =
  process.env.FROM_EMAIL || 'Formula Hellas <noreply@formulahellas.gr>';
export const EMAIL_REPLY_TO = process.env.REPLY_TO_EMAIL || 'noreply@formulahellas.gr';
export const EMAIL_BASE_URL = SITE_URL;

/** Convenience label used wherever a value is not yet available. */
export const COMING_SOON = 'Coming soon';

/** True when the public Register flow can be enabled (an email has been set). */
export const REGISTRATION_ENABLED = REGISTRATION_EMAIL !== null;
