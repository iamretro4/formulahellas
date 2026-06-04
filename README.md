# Formula Hellas Website

A modern, responsive website for Formula Hellas — a new Formula Student competition, part of the Formula Student World Competition Series, hosted at the Serres Racing Circuit in Northern Greece. The inaugural edition runs 02–07 August 2026.

## Features

- **Modern Racing-Inspired Design**: Clean, modern design with racing-inspired accents and animations
- **Enhanced UX**: Smooth scroll animations, interactive components, and improved mobile experience
- **CMS Integration**: Optional content management powered by Sanity.io (news, documents)
- **Pages**: Home, Competition 2026, About (incl. Classes & Venue), Registration & Fees, Rules & Documents, Join Us, Contact, Team Portal
- **SEO Optimized**: Built-in SEO features with Next.js
- **Type Safe**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io (optional)
- **Database**: Supabase (contact form, registration quiz)
- **Email**: Resend
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Editing content & contact details

Two files hold everything you are likely to change:

- **`lib/site-config.ts`** — brand name, production domain, and all contact details. Anything set to `null` (emails, social links, the Hub URL) renders as **"Coming soon"** in the UI with its link/button disabled. Replace a `null` with a real value to enable it. **Do not invent values** — leave them `null` until known.
- **`content/site.ts`** — all marketing copy (Home, About, Classes, Venue, Rules, Registration, Fees, Contact), in plain editable strings. Dates use DD-MM-YYYY format.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Set up environment variables in `.env.local` — see the `*_SETUP.md` files for Sanity, Supabase, Resend and Vercel configuration. The site renders without a CMS; CMS-backed sections (news, documents) simply stay empty.

3. Run the development server (port 3333):
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3333](http://localhost:3333) in your browser.

### Sanity Studio

Access the Sanity Studio at `/studio` to manage optional content (news, documents).

## Project Structure

```
app/                    # Next.js App Router pages
├── events/[year]/      # Competition 2026 page
├── about/              # About (incl. Classes & Venue)
├── registration/       # Registration, eligibility & fees
├── rules/              # Rules & Documents
├── join-us/            # Join Us (judge / scrutineer / volunteer)
├── contact/            # Contact
├── team-portal/        # Team Portal
└── studio/             # Sanity Studio
components/             # React components
content/site.ts        # Editable marketing copy
lib/
├── site-config.ts      # Brand, domain & contact constants ("Coming soon" placeholders)
├── sanity.queries.ts   # Sanity queries
└── seo.ts              # SEO / metadata helpers
public/                 # Static assets
```

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Production site URL (used for canonical URLs, sitemap, structured data)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` / `SANITY_API_TOKEN`: Sanity CMS (optional)
- `STUDIO_PASSWORD`: Password to access Sanity Studio
- `REVALIDATE_SECRET`: Secret token for on-demand revalidation webhook
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase (contact form, quiz)
- `RESEND_API_KEY`: Resend API key for sending emails
- `FROM_EMAIL`: Verified sender address for outgoing email (set to a Formula Hellas address once the sending domain is verified in Resend)
- `NOTIFICATION_EMAILS`: Comma-separated list of addresses to receive form submission notifications

## License

This project is private and proprietary.
