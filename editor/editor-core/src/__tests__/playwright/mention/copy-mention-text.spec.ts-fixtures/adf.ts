export const cardAndMentionAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hi ',
        },
        {
          type: 'mention',
          attrs: {
            id: '0',
            text: '@Carolyn',
            accessLevel: '',
          },
        },
        {
          type: 'text',
          text: ', How are you?',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {},
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
