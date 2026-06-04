import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, INSTAGRAM_URL, LINKEDIN_URL } from './site-config';

const siteUrl = SITE_URL;
const siteName = SITE_NAME;
const defaultDescription = SITE_DESCRIPTION;
const defaultImage = `${siteUrl}/logo-placeholder.svg`;

export interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = defaultDescription,
    image = defaultImage,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    noIndex = false,
    noFollow = false,
  } = config;

  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} — Formula Student at the Serres Racing Circuit`;

  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type,
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    metadataBase: new URL(siteUrl),
  };
}

export function generateStructuredData(config: {
  type: 'Organization' | 'Event' | 'Article' | 'WebSite';
  data: Record<string, any>;
}) {
  const { type, data } = config;

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo-placeholder.svg`,
        sameAs: [LINKEDIN_URL, INSTAGRAM_URL].filter(Boolean),
        ...data,
      };

    case 'Event':
      return {
        ...baseStructuredData,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: {
          '@type': 'Place',
          name: data.locationName,
          address: {
            '@type': 'PostalAddress',
            addressLocality: data.addressLocality || 'Serres',
            addressCountry: 'GR',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
        },
        ...data,
      };

    case 'Article':
      return {
        ...baseStructuredData,
        headline: data.headline,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: {
          '@type': 'Organization',
          name: siteName,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo-placeholder.svg`,
          },
        },
        ...data,
      };

    case 'WebSite':
      return {
        ...baseStructuredData,
        name: siteName,
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/posts?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };

    default:
      return baseStructuredData;
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

