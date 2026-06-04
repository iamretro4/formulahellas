import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'news',
  title: 'News & Announcements',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured News',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      description: 'Associated event (for event-related news)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, media, publishedAt }) {
      return {
        title,
        media,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : '',
      };
    },
  },
});

