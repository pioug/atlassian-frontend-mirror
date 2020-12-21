const randomId = () => Math.ceil(Math.random() * 1000000);
export const createAdf = (numberOfLinks = 500) => ({
  version: 1,
  type: 'doc',
  content: [
    ...Array(numberOfLinks)
      .fill(0)
      .map(() => [
        {
          type: 'paragraph',
          content: [
            {
              type: 'inlineCard',
              attrs: {
                url: `https://inlineCardTestUrl/${randomId()}`,
              },
            },
            {
              type: 'text',
              text: ' ',
            },
          ],
        },
      ])
      .reduce((acc, x) => acc.concat(x), []),
  ],
});
