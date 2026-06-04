import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'registrationQuiz',
  title: 'Registration Quiz Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Quiz Title',
      type: 'string',
      initialValue: 'Formula Hellas Registration Quiz',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Quiz Active',
      type: 'boolean',
      description: 'When active, the entire site will redirect to the quiz at the scheduled time',
      initialValue: false,
    }),
    defineField({
      name: 'testMode',
      title: 'Test Mode',
      type: 'boolean',
      description: 'When enabled, the quiz can be active but the public site will NOT redirect. Use this to test the quiz without closing the public site.',
      initialValue: false,
    }),
    defineField({
      name: 'redirectToGoogleForms',
      title: 'Redirect to Google Forms',
      type: 'boolean',
      description: 'When enabled, the entire site will redirect to the Google Forms quiz instead of the built-in quiz system.',
      initialValue: false,
    }),
    defineField({
      name: 'scheduledStartTime',
      title: 'Scheduled Start Date & Time',
      type: 'datetime',
      description: 'The exact date and time when the quiz should go live. The quiz will remain open for exactly 2 hours from this time and then automatically close. At this time, the homepage will automatically redirect to the quiz.',
      validation: (Rule) => Rule.required(),
    }),
    // Duration is fixed at 2 hours from start time - no need for durationMinutes field
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Question Text',
              type: 'text',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'type',
              title: 'Question Type',
              type: 'string',
              description: 'Multiple choice or open text question',
              options: {
                list: [
                  { title: 'Multiple Choice', value: 'multiple_choice' },
                  { title: 'Open Text', value: 'open_text' },
                ],
              },
              initialValue: 'multiple_choice',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'options',
              title: 'Answer Options',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Required for multiple choice questions',
              hidden: ({ parent }: any) => parent?.type === 'open_text',
              validation: (Rule: any) => 
                Rule.custom((options: string[] | undefined, context: any) => {
                  const questionType = context.parent?.type;
                  if (questionType === 'multiple_choice') {
                    if (!options || options.length < 2) {
                      return 'Multiple choice questions require at least 2 options';
                    }
                    if (options.length > 6) {
                      return 'Multiple choice questions can have at most 6 options';
                    }
                  }
                  return true;
                }),
            },
            {
              name: 'correctOption',
              title: 'Correct Answer',
              type: 'string',
              description: 'For multiple choice: must match one of the options exactly. For open text: optional reference answer (not used for auto-scoring)',
              hidden: ({ parent }: any) => parent?.type === 'open_text',
              validation: (Rule: any) => 
                Rule.custom((correctOption: string | undefined, context: any) => {
                  const questionType = context.parent?.type;
                  // For multiple choice, correctOption is optional (can be left empty for questions without a correct answer)
                  // For open text, correctOption is not shown/used
                  return true;
                }),
            },
            {
              name: 'image',
              title: 'Question Image',
              type: 'image',
              description: 'Optional image to display with the question',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'file',
              title: 'Question File',
              type: 'file',
              description: 'Optional file to download (PDF, DOC, PNG, etc.)',
              options: {
                accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.png',
              },
            },
            {
              name: 'category',
              title: 'Question Category',
              type: 'string',
              description: 'Which vehicle category this question applies to',
              options: {
                list: [
                  { title: 'Common (Both EV and CV)', value: 'common' },
                  { title: 'Electric Vehicle (EV) Only', value: 'EV' },
                  { title: 'Combustion Vehicle (CV) Only', value: 'CV' },
                ],
              },
              initialValue: 'common',
            },
          ],
          preview: {
            select: {
              title: 'text',
              type: 'type',
            },
            prepare({ title, type }: any) {
              return {
                title: title || 'Untitled Question',
                subtitle: type === 'open_text' ? 'Open Text' : 'Multiple Choice',
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'instructions',
      title: 'Quiz Instructions',
      type: 'text',
      rows: 4,
      description: 'Instructions shown to teams before starting the quiz',
      initialValue: 'Please read all questions carefully. You have one attempt. Your progress will be saved automatically.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      scheduledTime: 'scheduledStartTime',
    },
    prepare({ title, isActive, scheduledTime }) {
      return {
        title: title || 'Registration Quiz',
        subtitle: `${isActive ? '🟢 Active' : '🔴 Inactive'} - ${scheduledTime ? new Date(scheduledTime).toLocaleString() : 'No date set'}`,
      };
    },
  },
});

