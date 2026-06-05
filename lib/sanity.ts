import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'disabled';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const isConfigured = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// Create client with CDN enabled for read operations - reduces API calls by ~80%
const baseClient = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
  // CDN is safe for read operations and provides eventual consistency
});

export const client = {
  ...baseClient,
  fetch: async (query: string, params?: any, options?: any) => {
    if (!isConfigured) {
      console.warn('Sanity client fetch called, but NEXT_PUBLIC_SANITY_PROJECT_ID is not configured. Returning empty result.');
      return query.trim().startsWith('*') && !query.includes('[0]') ? [] : null;
    }
    return baseClient.fetch(query, params, options);
  }
} as any;

// Non-CDN client for write operations
const baseWriteClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

export const writeClient = {
  ...baseWriteClient,
  fetch: async (query: string, params?: any, options?: any) => {
    if (!isConfigured) {
      console.warn('Sanity writeClient fetch called, but NEXT_PUBLIC_SANITY_PROJECT_ID is not configured. Returning empty result.');
      return query.trim().startsWith('*') && !query.includes('[0]') ? [] : null;
    }
    return baseWriteClient.fetch(query, params, options);
  },
  patch: (id: string) => {
    if (!isConfigured) {
      return {
        set: () => ({
          commit: async () => ({})
        })
      };
    }
    return baseWriteClient.patch(id);
  }
} as any;

const builder = imageUrlBuilder(baseClient);

export function urlFor(source: SanityImageSource) {
  if (!isConfigured || !source) {
    return {
      url: () => '',
      width: () => ({ url: () => '' }),
      height: () => ({ url: () => '' }),
      blur: () => ({ url: () => '' }),
      format: () => ({ url: () => '' }),
    } as any;
  }
  return builder.image(source);
}


