export const simpleActionList = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      attrs: {
        localId: 'd4367ae3-5f11-4ff6-9a1d-e019f0c58218',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce1',
            state: 'TODO',
          },
          content: [
            {
              text: 'Task item 1',
              type: 'text',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce2',
            state: 'TODO',
          },
          content: [
            {
              text: 'Task item 2',
              type: 'text',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce3',
            state: 'DONE',
          },
          content: [
            {
              text: 'Task item 3',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};

export const simpleActionListWithShortText = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      attrs: {
        localId: 'd4367ae3-5f11-4ff6-9a1d-e019f0c58218',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce1',
            state: 'TODO',
          },
          content: [
            {
              text: 'T1',
              type: 'text',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce2',
            state: 'TODO',
          },
          content: [
            {
              text: 'T2',
              type: 'text',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce3',
            state: 'DONE',
          },
          content: [
            {
              text: 'T3',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};

export const simpleActionListWithShortTextAndNestedItemsList = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      attrs: {
        localId: 'd4367ae3-5f11-4ff6-9a1d-e019f0c58218',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce1',
            state: 'TODO',
          },
          content: [
            {
              text: 'T1',
              type: 'text',
            },
          ],
        },
        {
          type: 'taskList',
          attrs: {
            localId: 'd4367ae3-5f11-4ff6-9a1d-e019f0c58219',
          },
          content: [
            {
              type: 'taskItem',
              attrs: {
                localId: '9ff03d47-b975-474e-8370-d3624cd5cce12',
                state: 'TODO',
              },
              content: [
                {
                  text: 'T1',
                  type: 'text',
                },
              ],
            },
            {
              type: 'taskItem',
              attrs: {
                localId: '9ff03d47-b975-474e-8370-d3624cd5cce22',
                state: 'TODO',
              },
              content: [
                {
                  text: 'T2',
                  type: 'text',
                },
              ],
            },
            {
              type: 'taskItem',
              attrs: {
                localId: '9ff03d47-b975-474e-8370-d3624cd5cce32',
                state: 'DONE',
              },
              content: [
                {
                  text: 'T3',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce2',
            state: 'TODO',
          },
          content: [
            {
              text: 'T2',
              type: 'text',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '9ff03d47-b975-474e-8370-d3624cd5cce3',
            state: 'DONE',
          },
          content: [
            {
              text: 'T3',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};
