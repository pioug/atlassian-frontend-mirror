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
  ],
};

export const cardFatalAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello have a fatal link ',
        },
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://inlineCardTestUrl/errored/fatal',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
  ],
};
