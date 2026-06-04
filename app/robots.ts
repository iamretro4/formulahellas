import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';

const siteUrl = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',
          '/api/',
          '/team-portal/',
          '/registration-tests/admin/',
          '/test-email/',
          '/studio-debug/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

