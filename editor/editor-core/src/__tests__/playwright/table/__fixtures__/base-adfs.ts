export const nestedInExtension = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        parameters: {
          macroParams: {},
          macroMetadata: {
            placeholder: [
              {
                data: {
                  url: '',
                },
                type: 'icon',
              },
            ],
          },
        },
        localId: 'testId',
        layout: 'default',
      },
      content: [
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: {
                    colwidth: [242],
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colwidth: [308],
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colwidth: [176],
                  },
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
                    colwidth: [242],
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
                  attrs: {
                    colwidth: [308],
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
                  attrs: {
                    colwidth: [176],
                  },
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
                    colwidth: [242],
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
                  attrs: {
                    colwidth: [308],
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
                  attrs: {
                    colwidth: [176],
                  },
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
    },
  ],
};

export const documentWithMergedCells = {
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
              attrs: {
                colwidth: [151],
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [98],
                background: '#deebff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [275],
                background: '#e6fcff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '3',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [83],
                background: '#eae6ff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '4',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [152],
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '5',
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
                colwidth: [151],
                background: '#e6fcff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 3,
                rowspan: 3,
                colwidth: [98, 275, 83],
                background: '#fffae6',
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
              attrs: {
                colwidth: [152],
                background: '#e6fcff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '2',
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
                colwidth: [151],
                background: '#ffebe6',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '3',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [152],
                background: '#ffebe6',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '3',
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
                colwidth: [151],
                background: '#e3fcef',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '4',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [152],
                background: '#e3fcef',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '4',
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
                colwidth: [151],
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '5',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [98],
                background: '#deebff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [275],
                background: '#e6fcff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '3',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [83],
                background: '#eae6ff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '4',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [152],
                background: '#ffffff',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '5',
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

export const nestedInLayout = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'layoutSection',
      content: [
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'table',
              attrs: {
                isNumberColumnEnabled: false,
                layout: 'default',
                localId: 'ff141c14-e34f-4798-9269-8198f3bce2aa',
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
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
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

export const simpleTableAfterParagraph = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'content',
        },
      ],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: '114ea369-b416-4e08-9be4-f262d2b0d797',
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
          ],
        },
      ],
    },
  ],
};

export const simpleTableWithOneParagraphAfter = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'localId',
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
export const simpleTableWithTwoParagraphAfter = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'localId',
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
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const simpleTable = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'localId',
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
          ],
        },
      ],
    },
  ],
};

export const tableWithActionItemInTheLastRow = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'localId',
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
