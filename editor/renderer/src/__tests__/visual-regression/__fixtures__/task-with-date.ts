export const taskWithDateAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          content: [
            {
              type: 'date',
              attrs: {
                timestamp: Date.now(),
              },
            },
          ],
          attrs: {
            localId: 'test-list-id',
            state: 'TODO',
          },
        },
      ],
      attrs: {
        localId: 'test-id',
      },
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
