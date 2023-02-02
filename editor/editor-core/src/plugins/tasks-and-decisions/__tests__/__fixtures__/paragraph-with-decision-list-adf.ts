export const paragraphWithDecisionList = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'test',
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: '1c3b089f-6e80-4b01-8580-14f92568e7d8',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '897a3905-785c-4880-b494-327024cbeb5f',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'test',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const paragraphWithDecisionListWithoutContent = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'test',
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: '1c3b089f-6e80-4b01-8580-14f92568e7d8',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '897a3905-785c-4880-b494-327024cbeb5f',
            state: 'DECIDED',
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
