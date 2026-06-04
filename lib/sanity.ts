import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. Please add it to your .env.local file.'
  );
}

// Create client with CDN enabled for read operations - reduces API calls by ~80%
// CDN is safe for read operations and dramatically reduces API usage
export const client = createClient({
  projectId,
  dataset,
  useCdn: true, // Enable CDN for read operations - reduces API calls significantly
  apiVersion: '2024-01-01',
  // CDN is safe for read operations and provides eventual consistency
  // Quiz content is set before activation, so CDN caching is safe
});

// Non-CDN client for write operations (if needed in the future)
export const writeClient = createClient({
  projectId,
  dataset,
  useCdn: false, // Disable CDN for writes to ensure immediate consistency
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Only needed for write operations
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

