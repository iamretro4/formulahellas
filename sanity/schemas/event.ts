import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'Name of the racing circuit or venue',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Current', value: 'current' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
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
      name: 'registrationOpen',
      title: 'Registration Open',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      status: 'status',
      media: 'featuredImage',
    },
    prepare({ title, year, status, media }) {
      return {
        title: `${title} (${year})`,
        subtitle: status ? status.charAt(0).toUpperCase() + status.slice(1) : '',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Year, Newest',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Year, Oldest',
      name: 'yearAsc',
      by: [{ field: 'year', direction: 'asc' }],
    },
  ],
});

