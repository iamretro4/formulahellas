import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Home',
      readOnly: true,
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading on the hero section',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle text on the hero section',
    }),
    defineField({
      name: 'competitionTitle',
      title: 'Competition Title',
      type: 'string',
      description: 'Title for the competition info section (e.g., "Formula Hellas 2026")',
    }),
    defineField({
      name: 'competitionDescription',
      title: 'Competition Description',
      type: 'text',
      description: 'Description text for the competition info section',
    }),
    defineField({
      name: 'quickLinksTitle',
      title: 'Quick Links Section Title',
      type: 'string',
      description: 'Title for the quick links section',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Home Page',
      };
    },
  },
});











