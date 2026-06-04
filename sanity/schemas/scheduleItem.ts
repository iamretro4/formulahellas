import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'scheduleItem',
  title: 'Schedule Item',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g., "09:00" or "09:00 - 12:00"',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where this event takes place',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Registration', value: 'registration' },
          { title: 'Technical Inspection', value: 'technical-inspection' },
          { title: 'Static Events', value: 'static-events' },
          { title: 'Dynamic Events', value: 'dynamic-events' },
          { title: 'Awards', value: 'awards' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order for this item on the schedule',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      time: 'time',
      type: 'type',
      event: 'event.title',
    },
    prepare({ title, date, time, type, event }) {
      return {
        title,
        subtitle: `${date || 'No date'}${time ? ` at ${time}` : ''}${type ? ` - ${type}` : ''}${event ? ` (${event})` : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Date & Time',
      name: 'dateTimeAsc',
      by: [
        { field: 'date', direction: 'asc' },
        { field: 'time', direction: 'asc' },
      ],
    },
  ],
});

