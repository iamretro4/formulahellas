import {
  Instagram,
  Facebook,
  Twitter,
  Music2,
  Globe,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import VenueImage from './VenueImage';
import {
  VENUE_NAME,
  VENUE_URL,
  VENUE_INSTAGRAM_URL,
  VENUE_FACEBOOK_URL,
  VENUE_X_URL,
  VENUE_TIKTOK_URL,
  VENUE_ADDRESS,
  VENUE_PHONE,
  VENUE_EMAIL,
  VENUE_MAPS_EMBED,
} from '@/lib/site-config';

interface VenueShowcaseProps {
  aerialImage?: string;
  aerialAlt?: string;
  collageImage?: string;
  logoDarkImage?: string;
  mediaHeading: string;
  mediaIntro?: string;
  socialHeading: string;
  videos: string[];
  locationHeading: string;
}

// Build a Facebook video-plugin embed URL from a public reel/video URL.
function facebookEmbedSrc(videoUrl: string): string {
  const href = encodeURIComponent(videoUrl);
  return `https://www.facebook.com/plugins/video.php?height=476&href=${href}&show_text=false&width=267&t=0`;
}

const socials: Array<{ label: string; url: string | null; Icon: typeof Instagram }> = [
  { label: 'Instagram', url: VENUE_INSTAGRAM_URL, Icon: Instagram },
  { label: 'Facebook', url: VENUE_FACEBOOK_URL, Icon: Facebook },
  { label: 'X', url: VENUE_X_URL, Icon: Twitter },
  { label: 'TikTok', url: VENUE_TIKTOK_URL, Icon: Music2 },
];

export default function VenueShowcase({
  aerialImage,
  aerialAlt = 'Serres Racing Circuit',
  collageImage,
  logoDarkImage,
  mediaHeading,
  mediaIntro,
  socialHeading,
  videos,
  locationHeading,
}: VenueShowcaseProps) {
  const activeSocials = socials.filter((s) => s.url);

  // Structured data — helps search engines associate the circuit (and its
  // official channels, contact details and location) with this page.
  const venueStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: VENUE_NAME,
    description:
      'The largest racing circuit in the Balkans and the only FIA and FIM accredited motorsport facility in Greece, operating since 1998 and built to the safety standards for racing up to Formula 3.',
    url: VENUE_URL,
    foundingDate: '1998',
    telephone: VENUE_PHONE,
    email: VENUE_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Omonia Sports Park',
      addressLocality: 'Serres',
      addressCountry: 'GR',
    },
    sameAs: activeSocials.map((s) => s.url),
  };

  return (
    <div className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueStructuredData) }}
      />

      {/* Aerial banner */}
      {aerialImage && (
        <VenueImage
          src={aerialImage}
          alt={aerialAlt}
          className="w-full h-auto rounded-2xl shadow-md border border-gray-200 mb-12"
        />
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{mediaHeading}</h3>
          {mediaIntro && <p className="text-gray-600 mb-6">{mediaIntro}</p>}
          <div className="flex flex-wrap justify-center gap-6">
            {videos.map((videoUrl, i) => (
              <div
                key={videoUrl}
                className="w-full max-w-[267px] aspect-[267/476] rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50"
              >
                <iframe
                  src={facebookEmbedSrc(videoUrl)}
                  title={`${VENUE_NAME} video ${i + 1}`}
                  className="w-full h-full"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  loading="lazy"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Venue social channels + website */}
      <div className="bg-ink text-white rounded-2xl p-6 sm:p-8 text-center">
        {logoDarkImage && (
          <VenueImage
            src={logoDarkImage}
            alt={`${VENUE_NAME} logo`}
            className="h-32 w-auto mx-auto mb-2"
          />
        )}
        <h3 className="text-xl font-bold mb-2">{socialHeading}</h3>
        <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">
          {VENUE_NAME} is the host and organiser of Formula Hellas. Follow the circuit for
          news, events and behind-the-scenes from the largest track in the Balkans.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {activeSocials.map(({ label, url, Icon }) => (
            <a
              key={label}
              href={url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-primary-blue transition-colors text-sm font-semibold"
              aria-label={`${VENUE_NAME} on ${label}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
          <a
            href={VENUE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm font-bold"
          >
            <Globe className="w-4 h-4" />
            serrescircuit.gr
          </a>
        </div>
      </div>

      {/* Location & venue contact */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{locationHeading}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map (embedded) */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm min-h-[320px]">
            <iframe
              src={VENUE_MAPS_EMBED}
              title={`${VENUE_NAME} on Google Maps`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* Details */}
          <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-6">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                <span>{VENUE_ADDRESS}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                <a href={`tel:${VENUE_PHONE.replace(/\s+/g, '')}`} className="hover:text-primary-blue">
                  {VENUE_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                <a href={`mailto:${VENUE_EMAIL}`} className="hover:text-primary-blue">
                  {VENUE_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Location and contact details are for the {VENUE_NAME} (the venue &amp; host).
        </p>
      </div>

      {/* Promotional banner */}
      {collageImage && (
        <VenueImage
          src={collageImage}
          alt={`${VENUE_NAME}`}
          className="w-full h-auto rounded-2xl shadow-md border border-gray-200 mt-12"
        />
      )}
    </div>
  );
}
