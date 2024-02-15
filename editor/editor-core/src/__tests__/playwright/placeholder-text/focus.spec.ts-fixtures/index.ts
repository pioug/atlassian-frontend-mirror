export const placeholderAndEmptyParagraph = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'placeholder',
          attrs: {
            text: 'Fill this in...',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
