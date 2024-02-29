export const simpleTable = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'abc-123',
        width: null,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'aa',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ab',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ac',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ba',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'bb',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'bc',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ca',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cb',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cc',
                    },
                  ],
                },
              ],
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

export const simpleTableWithLargeRows = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'abc-123',
        width: null,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'aa',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'aa',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'aa',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ab',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ac',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ba',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ba',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ba',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'bb',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'bc',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ca',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ca',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ca',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cb',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cc',
                    },
                  ],
                },
              ],
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

export const tableWithMergedCells = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'e9aa5791-29f3-43cd-89e9-0776f89b0e47',
        width: 760,
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
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                rowspan: 2,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
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
    },
  ],
};
