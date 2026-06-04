import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      // Logo is optional - sponsors can be displayed with just name if no logo
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'tier',
      title: 'Sponsor Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Title Partner', value: 'title-partner' },
          { title: 'Premium Partner', value: 'premium-partner' },
          { title: 'Gold Partner', value: 'gold-partner' },
          { title: 'Silver Partner', value: 'silver-partner' },
          { title: 'Bronze Partner', value: 'bronze-partner' },
          { title: 'Supporter', value: 'supporter' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      description: 'Associated event (for year-specific sponsors)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      tier: 'tier',
    },
    prepare({ title, media, tier }) {
      return {
        title,
        media,
        subtitle: tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : '',
      };
    },
  },
  orderings: [
    {
      title: 'Tier, then Order',
      name: 'tierOrder',
      by: [
        { field: 'tier', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
});

