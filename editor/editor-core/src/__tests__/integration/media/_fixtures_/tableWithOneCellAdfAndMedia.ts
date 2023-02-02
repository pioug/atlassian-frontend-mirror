const adf = (id: string) => ({
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
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'mediaSingle',
                  attrs: {
                    layout: 'center',
                  },
                  content: [
                    {
                      type: 'media',
                      attrs: {
                        id,
                        type: 'file',
                        collection: 'MediaServicesSample',
                        width: 2378,
                        height: 628,
                      },
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
});

export default adf;
