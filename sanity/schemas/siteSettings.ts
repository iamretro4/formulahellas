import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // __experimental_actions removed in Sanity v4
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Address',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'technicalEmail',
          title: 'Technical Email',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer Settings',
      type: 'object',
      fields: [
        {
          name: 'description',
          title: 'Footer Description',
          type: 'text',
          rows: 3,
          description: 'Description text shown in the footer',
        },
        {
          name: 'quickLinks',
          title: 'Quick Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Link Label',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'Link URL',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'url',
                },
              },
            },
          ],
        },
        {
          name: 'joinUsLinks',
          title: 'Join Us Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Link Label',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'Link URL',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'url',
                },
              },
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});

