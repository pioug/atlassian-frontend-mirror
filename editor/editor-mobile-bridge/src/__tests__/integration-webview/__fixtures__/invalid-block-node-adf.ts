export const invalidBlockAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello text',
        },
      ],
    },
    {
      type: 'Broken-Type',
      attrs: {},
    },
  ],
};
