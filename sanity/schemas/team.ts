import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Team Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'CV', value: 'CV' },
          { title: 'EV', value: 'EV' },
          { title: 'DV', value: 'DV' },
        ],
      },
    }),
    defineField({
      name: 'registeredEvents',
      title: 'Registered Events',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }],
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      country: 'country',
      media: 'logo',
    },
    prepare({ title, country, media }) {
      return {
        title,
        subtitle: country || 'No country',
        media,
      };
    },
  },
});

