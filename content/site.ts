/**
 * Formula Hellas — editable site content.
 *
 * All marketing copy lives here so it can be updated without touching page
 * components. Pages import named sections from this file. Contact details,
 * social links and the production domain live separately in `lib/site-config.ts`.
 *
 * Dates are written in DD-MM-YYYY format per the brand guidelines.
 */

import {
  COMPETITION_DATES,
  COMPETITION_DATES_LONG,
  COMPETITION_LOCATION,
  REGISTRATION_OPENS,
  REGISTRATION_CLOSES,
  VENUE_NAME,
} from '@/lib/site-config';

/* ------------------------------- HOME / HERO ------------------------------ */

export const hero = {
  heading: 'Formula Hellas',
  tagline:
    'Built by Formula Student alumni. Hosted at the Serres Racing Circuit, the only FIA- and FIM-accredited circuit in Greece.',
  keyFacts: [
    { label: 'Dates', value: COMPETITION_DATES },
    { label: 'Venue', value: COMPETITION_LOCATION },
    { label: 'Edition', value: 'First edition' },
  ],
  // Registration window text shown beside the (disabled) Register CTA.
  registrationNotice: `Registration opens ${REGISTRATION_OPENS}.`,
};

export const home = {
  intro: {
    heading: 'The first Formula Hellas',
    body: `Formula Hellas is a new Formula Student competition, run by Formula Student alumni together with the ${VENUE_NAME} in Northern Greece. Its first edition runs ${COMPETITION_DATES_LONG} and brings university teams together to design, build and race formula-style cars at the largest racing circuit in the Balkans. Formula Hellas is part of the Formula Student World Competition Series.`,
  },
  highlights: [
    {
      title: 'Two classes in 2026',
      body: 'An Internal Combustion (CV) class and an Electric (EV) class, with 12 team slots each.',
    },
    {
      title: 'A circuit built for it',
      body: 'Built to the safety standards for racing up to Formula 3, and equipped for the full range of Formula Student dynamic events.',
    },
    {
      title: 'Development over rankings',
      body: 'Meaningful, constructive feedback and genuine team development, with every team evaluated as an independent entity, in respect of its level and goals.',
    },
  ],
};

/* ---------------------------------- ABOUT --------------------------------- */

export const about = {
  title: 'About Formula Hellas',
  intro: `Formula Hellas is a new Formula Student competition, organised by Formula Student alumni together with the ${VENUE_NAME}. The first edition takes place ${COMPETITION_DATES_LONG} and is part of the Formula Student World Competition Series.`,

  whatIs: {
    heading: 'What is Formula Student?',
    body: 'Formula Student is an international engineering competition in which university teams design, build and race formula-style cars. It challenges students to turn classroom theory into a real, competitive vehicle, building engineering, project-management and teamwork skills along the way.',
  },

  mission: {
    heading: 'Our mission',
    body: 'Our mission is simple: give Greece its own Formula Student competition, help teams get better with every run, and, best of all, have fun on track.',
  },

  organisers: {
    heading: 'Who we are',
    body: `Formula Hellas is run by a team of Formula Student alumni who've lived the competition first-hand, together with the ${VENUE_NAME}. As part of the Formula Student World Competition Series, it follows the international standards teams already know.`,
  },

  classes: {
    heading: 'Classes (2026)',
    intro: 'Formula Hellas 2026 runs two vehicle classes, with places allocated first come, first served.',
    items: [
      {
        name: 'Internal Combustion Vehicle (CV) Class',
        slots: '12 team slots',
        body: 'For teams competing with a combustion-engine formula-style car.',
      },
      {
        name: 'Electric Vehicle (EV) Class',
        slots: '12 team slots',
        body: 'For teams competing with a fully electric formula-style car.',
      },
    ],
    note: 'There is no Driverless Cup and there are no Driverless events in 2026.',
  },

  venue: {
    heading: 'The venue',
    body: `Formula Hellas is hosted at the ${VENUE_NAME}, the largest racing circuit in the Balkans and the only FIA- and FIM-accredited motorsport facility in Greece. Operating since 1998 and built to the safety standards required for racing up to Formula 3, the circuit offers the full range of facilities needed for Formula Student dynamic events.`,
    facilities: [
      {
        title: 'Exclusive pit boxes',
        body: 'Every team receives its own pit box: a covered, organised and secure workspace with direct access to the track.',
      },
      {
        title: 'On-site campsite',
        body: 'A campsite is available for the full duration of the competition.',
      },
      {
        title: 'Full dynamic-event layout',
        body: 'The circuit provides the space and specification required for the Formula Student dynamic events.',
      },
    ],
    // Serres Racing Circuit imagery (local files in public/images/venue/).
    aerialImage: '/images/venue/serres-aerial.jpg',
    aerialAlt: 'Aerial view of the Serres Racing Circuit',
    collageImage: '/images/venue/serres-collage.png',
    logoImage: '/images/venue/src-logo.png', // dark logo, for light backgrounds
    logoDarkImage: '/images/venue/src-logo-white.jpg', // white logo, for dark backgrounds
    mediaHeading: 'See the circuit in action',
    mediaIntro:
      'A few laps around the Serres Racing Circuit, the largest racing circuit in the Balkans.',
    // Facebook reels from the Serres Racing Circuit page. Add/remove reel URLs here.
    videos: [
      'https://www.facebook.com/reel/2508107492880593/',
      'https://www.facebook.com/reel/2266788307113632/',
    ],
    socialHeading: 'Follow the Serres Racing Circuit',
    locationHeading: 'Find the circuit',
  },
};

/* ---------------------------------- RULES --------------------------------- */

export const rules = {
  title: 'Rules & Documents',
  intro:
    'Formula Hellas runs in compliance with the Formula Student Rules 2026 (V1.1), together with a set of Formula Hellas additions and clarifications. Find the rulebook and supporting documents below.',
  fsRules: {
    title: 'Formula Student Rules 2026 (V1.1)',
    description:
      'The official Formula Student rules document for the 2026 season (Version 1.1), published on the Formula Student Germany homepage.',
    // Official FSG rulebook (real, external link).
    url: 'https://www.formulastudent.de/fileadmin/user_upload/all/2026/rules/FS-Rules_2026_v1.1.pdf',
  },
  additions: {
    title: 'Formula Hellas Additions & Clarifications',
    description:
      'Competition-specific additions and clarifications that apply on top of the Formula Student Rules 2026.',
  },
  note: 'All teams must comply with the Formula Student Rules 2026 (V1.1) and the Formula Hellas additions and clarifications.',
};

/* ----------------------- REGISTRATION & ELIGIBILITY ----------------------- */

export const registration = {
  title: 'Registration',
  intro: `Registration for Formula Hellas 2026 is first come, first served, with 12 Electric (EV) and 12 Internal Combustion (CV) slots. Registration opens ${REGISTRATION_OPENS} and closes ${REGISTRATION_CLOSES}.`,

  window: {
    heading: 'Registration window',
    opens: REGISTRATION_OPENS,
    closes: REGISTRATION_CLOSES,
  },

  howTo: {
    heading: 'How to register',
    steps: [
      'The team captain sends a registration email including: team name, university, category (EV or CV), and the team captain’s full name and contact details.',
      'Slots are allocated in the order in which complete emails are received.',
      'Once a category is full, further teams are placed on a waiting list.',
      'Every team receives a confirmation, either a confirmed slot or a place on the waiting list.',
    ],
  },

  hub: {
    heading: 'After you secure a slot',
    body: 'Teams that secure a slot receive instructions to create a profile and register their members on the Formula Hellas Hub, which handles file uploads, member designation, and digital inspection and event functions.',
    accountFields: [
      'Team name',
      'University',
      'Country',
      'Team captain full name',
      'Team captain email (used as the username)',
      'FSG ID',
      'Password',
      'Organisation name',
      'Billing address',
      'VAT ID',
    ],
  },
};

/* --------------------------------- CONTACT -------------------------------- */

export const contact = {
  title: 'Contact',
  intro:
    'Have a question about Formula Hellas? Reach out using the channels below. Some contact details are being finalised and are marked “Coming soon”.',
  channels: [
    { key: 'general', label: 'General inquiries' },
    { key: 'technical', label: 'Technical inquiries' },
    { key: 'registration', label: 'Registration' },
  ],
  venueNote:
    'Formula Hellas is hosted and organised by the Serres Racing Circuit.',
};

/* ---------------------------------- JOIN ---------------------------------- */

export const joinUs = {
  title: 'Join Us',
  intro:
    'Formula Hellas relies on dedicated judges, scrutineers and volunteers to bring its first edition to life. Join the team and be part of it from the very start.',
};
