export const invalidInlineAdf = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'unknown type',
          attrs: {
            text: 'Invalid inline node content',
          },
        },
      ],
    },
  ],
};
