import { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0066FF',
    icons: [
      {
        // Placeholder — replace with the final Formula Hellas icon.
        src: '/logo-placeholder.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
