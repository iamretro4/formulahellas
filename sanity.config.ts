import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

// Get environment variables - these are available at build time and runtime in Next.js
// NEXT_PUBLIC_ variables are embedded at build time
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  // Don't throw - let Sanity Studio show the error UI instead
  // This allows the page to load and show a helpful error message
  console.error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. Please add it to your environment variables.'
  );
}

export default defineConfig({
  name: 'formulahellas',
  title: 'Formula Hellas',
  projectId: projectId || '', // Empty string will cause Sanity to show an error
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});

