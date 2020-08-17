export const documentWithDecision = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'xx',
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'e04fcc6e-51e4-4521-9df6-bb1281bffa92',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '137535a4-4a1f-4188-a9ce-ab58ca816984',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'Decision 1',
            },
          ],
        },
        {
          type: 'decisionItem',
          attrs: {
            localId: '137535a4-4a1f-4188-a9ce-ab58ca816984',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'Decision 2',
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'h3',
        },
      ],
    },
  ],
};
