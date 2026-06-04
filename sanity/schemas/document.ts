import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'competitionDocument',
  title: 'Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Competition Handbook', value: 'handbook' },
          { title: 'Event Handbook', value: 'event-handbook' },
          { title: 'Rules', value: 'rules' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Document',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      description: 'Associated event (for year-based organization)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
    },
    prepare({ title, category }) {
      return {
        title,
        subtitle: category,
      };
    },
  },
});

