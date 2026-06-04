import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Join Us', value: 'join-us' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
            },
            {
              name: 'text',
              title: 'Text',
              type: 'array',
              of: [{ type: 'block' }],
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
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
      page: 'page',
    },
    prepare({ title, page }) {
      return {
        title,
        subtitle: page ? page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ') : '',
      };
    },
  },
});

