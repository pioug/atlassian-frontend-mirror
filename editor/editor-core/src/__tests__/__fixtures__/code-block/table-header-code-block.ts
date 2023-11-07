export const tableHeaderCodeBlock = {
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
          content: [
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'codeBlock',
                  attrs: {},
                  content: [
                    {
                      type: 'text',
                      text: 'Can we have nice things?',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
