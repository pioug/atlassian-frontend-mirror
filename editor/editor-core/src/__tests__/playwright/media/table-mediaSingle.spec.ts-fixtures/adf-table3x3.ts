export const table3x3 = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
      },
      content: [
        {
          type: 'tableRow',
          content: new Array(3).fill({
            type: 'tableHeader',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          }),
        },
        {
          type: 'tableRow',
          content: new Array(3).fill({
            type: 'tableCell',
            attrs: {},
            content: [],
          }),
        },
        {
          type: 'tableRow',
          content: new Array(3).fill({
            type: 'tableCell',
            attrs: {},
            content: [],
          }),
        },
      ],
    },
  ],
};
