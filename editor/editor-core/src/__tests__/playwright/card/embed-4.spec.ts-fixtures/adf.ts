export const embedCardAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl/fallback',
        layout: 'center',
      },
    },
  ],
};
