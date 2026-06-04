import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/sanity.queries';
import { SITE_URL } from '@/lib/site-config';

const siteUrl = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/events/2026',
    '/about',
    '/registration',
    '/rules',
    '/join-us',
    '/contact',
    '/team-portal',
    '/posts',
  ];

  // Dynamic blog posts (optional, from CMS).
  const posts = await getPosts().catch(() => []);

  const postPages = posts.map((post: any) => ({
    url: `${siteUrl}/posts/${post.slug?.current || post.slug}`,
    lastModified: post._updatedAt || post.publishedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? ('daily' as const) : ('weekly' as const),
      priority: path === '' ? 1 : 0.8,
    })),
    ...postPages,
  ];
}
