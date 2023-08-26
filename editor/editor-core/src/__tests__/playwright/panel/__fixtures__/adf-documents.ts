export const emptyDocument = {
  version: 1,
  type: 'doc',
  content: [],
};

export const bulletListDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ],
    },
  ],
};
