export const documentWithInlineCard = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is an inline card',
        },
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://inlineCardTestUrl',
          },
        },
        {
          type: 'text',
          text: '. This is end of sentence.',
        },
      ],
    },
  ],
};
