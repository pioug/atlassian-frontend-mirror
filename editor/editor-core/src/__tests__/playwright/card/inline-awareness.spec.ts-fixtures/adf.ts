export const inlineCardAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://inlineCardTestUrl',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://inlineCardTestUrl/longName',
          },
        },
      ],
    },
  ],
};
