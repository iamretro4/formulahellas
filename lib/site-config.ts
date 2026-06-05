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
  'Built by Formula Student alumni. Hosted at the Serres Racing Circuit, the only FIA- and FIM-accredited circuit in Greece.';

export const SITE_DESCRIPTION =
  'Formula Hellas is a new Formula Student competition, part of the Formula Student World Competition Series, hosted at the Serres Racing Circuit in Northern Greece. The first edition runs 02–07 August 2026.';

/**
 * Production domain — used for canonical URLs, the sitemap and structured data.
 * Confirmed as formulahellas.gr. Override per-environment with NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://formulahellas.gr';

/* -------------------------------------------------------------------------- */
/*  Contact emails — set a string to enable, leave null for "Coming soon".    */
/* -------------------------------------------------------------------------- */

/** General inquiries. */
export const CONTACT_EMAIL: string | null = 'infofhsrc@serrescircuit.gr';
/** Technical inquiries. */
export const TECHNICAL_EMAIL: string | null = 'infofhsrc@serrescircuit.gr';
/** Team registration (team captains email this to register). */
export const REGISTRATION_EMAIL: string | null = 'infofhsrc@serrescircuit.gr';
/** Billing / payment / invoice questions. */
export const INFO_EMAIL: string | null = 'infofhsrc@serrescircuit.gr';

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
 * Serres Racing Circuit's own social channels (the venue/host's accounts, not
 * Formula Hellas's). Verified from serrescircuit.gr. Set to null to hide one.
 */
export const VENUE_INSTAGRAM_URL: string | null = 'https://www.instagram.com/serres.racing.circuit/';
export const VENUE_FACEBOOK_URL: string | null = 'https://www.facebook.com/serres.racing.circuit';
export const VENUE_X_URL: string | null = 'https://x.com/SerresRacing';
export const VENUE_TIKTOK_URL: string | null = 'https://www.tiktok.com/@serres.racing.circuit';

/* Serres Racing Circuit location & contact (the venue's own details, verified from serrescircuit.gr). */
export const VENUE_ADDRESS = 'Omonia Sports Park, Serres, Greece';
export const VENUE_PHONE = '+30 23210 52592';
export const VENUE_EMAIL = 'info@serrescircuit.gr';
export const VENUE_HOURS = 'Daily, 09:00 until one hour before sunset';
/** Google Maps share link for the circuit (used for the "Open in Google Maps" button). */
export const VENUE_MAPS_LINK = 'https://share.google/oqBBUJPwXYsUPg2le';
/** Keyless Google Maps embed (place search). */
export const VENUE_MAPS_EMBED =
  'https://www.google.com/maps?q=Serres%20Racing%20Circuit%2C%20Serres%2C%20Greece&output=embed';

/**
 * External "Formula Hellas Hub" portal where registered teams manage their
 * profile, uploads and inspections. Leave null until the Hub URL is known
 * (renders the Team Portal login as "Coming soon").
 */
export const TEAM_PORTAL_URL: string | null = null;

/* -------------------------------------------------------------------------- */
/*  Application Google Forms — set to null to fall back to direct email.      */
/* -------------------------------------------------------------------------- */
export const APPLY_JUDGE_URL: string | null = 'https://docs.google.com/forms/d/e/1FAIpQLSc7GysKvKyjWkXhf9jUd4j6dFwUL2e76ud9cuL9CLv9rbbK5g/viewform?usp=dialog';
export const APPLY_SCRUTINEER_URL: string | null = 'https://docs.google.com/forms/d/e/1FAIpQLSfpjrcRlmrMmDGh2-etFPPL07EenVwvzKZeleUCl-UE1Gwr4A/viewform?usp=dialog';
export const APPLY_VOLUNTEER_URL: string | null = 'https://docs.google.com/forms/d/e/1FAIpQLSc_eblYXqoTzIVO97QBgw2nuH4dPXOwAuAnq__W4zNfhNAUGw/viewform?usp=dialog';
export const APPLICATIONS_ENABLED = true;

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

export const EMAIL_FROM_NOTIFICATIONS =
  process.env.FROM_EMAIL || 'Formula Hellas <infofhsrc@serrescircuit.gr>';
export const EMAIL_BASE_URL = SITE_URL;

/** Convenience label used wherever a value is not yet available. */
export const COMING_SOON = 'Coming soon';

/** True when the public Register flow can be enabled (an email has been set). */
export const REGISTRATION_ENABLED = REGISTRATION_EMAIL !== null;
