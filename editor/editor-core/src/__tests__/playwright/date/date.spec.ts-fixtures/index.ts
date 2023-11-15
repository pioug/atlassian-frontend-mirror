export const taskDateAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      attrs: {
        localId: 'test-list-id',
        order: 1,
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'test-id',
            state: 'TODO',
          },
          content: [
            {
              type: 'date',
              attrs: {
                timestamp: '1502805600000',
              },
            },
          ],
        },
      ],
    },
  ],
};

export const escapeKeydownAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'date',
          attrs: {
            timestamp: '1658102400000',
          },
        },
        {
          type: 'text',
          text: '  ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
