import {
  bodiedExtension,
  doc,
  expand,
  p,
  strong,
  table,
  td,
  tdEmpty,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

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

export const simpleTableNestedInExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: 'Expand title',
      },
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
    },
  ],
};
export const simpleTableNestedInMacro = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'excerpt',
        parameters: {
          macroParams: {
            hidden: {
              value: 'false',
            },
          },
        },
        layout: 'default',
        localId: 'testId',
      },
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
    },
  ],
};

export const simpleTableWithMergedCell = {
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
                rowspan: 2,
                background: '#deebff',
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
                      text: 'ba',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                background: '#deebff',
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
                background: '#deebff',
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
                background: '#b3d4ff',
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
                background: '#b3d4ff',
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
                background: '#4c9aff',
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
                background: '#4c9aff',
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
                background: '#4c9aff',
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

export const simpleTableWithMergedCells = {
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
                background: '#deebff',
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
                rowspan: 2,
                background: '#deebff',
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
              type: 'tableHeader',
              attrs: {
                background: '#deebff',
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
                background: '#b3d4ff',
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
                background: '#b3d4ff',
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
                background: '#4c9aff',
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
                background: '#4c9aff',
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
                background: '#4c9aff',
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

export const simpleTableWithMergedCellsInExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: 'Expand title',
      },
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
                    background: '#deebff',
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
                    rowspan: 2,
                    background: '#deebff',
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
                  type: 'tableHeader',
                  attrs: {
                    background: '#deebff',
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
                    background: '#b3d4ff',
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
                    background: '#b3d4ff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
    },
  ],
};

export const simpleTableWithMergedCellsInExtension = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'excerpt',
        parameters: {
          macroParams: {
            hidden: {
              value: 'false',
            },
          },
        },
        layout: 'default',
        localId: 'testId',
      },
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
                    background: '#deebff',
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
                    rowspan: 2,
                    background: '#deebff',
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
                  type: 'tableHeader',
                  attrs: {
                    background: '#deebff',
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
                    background: '#b3d4ff',
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
                    background: '#b3d4ff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
    },
  ],
};

export const simpleTableWithMergedCellInExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: 'Expand title',
      },
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
                    rowspan: 2,
                    background: '#deebff',
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
                          text: 'ba',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    background: '#deebff',
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
                    background: '#deebff',
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
                    background: '#b3d4ff',
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
                    background: '#b3d4ff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
    },
  ],
};
export const simpleTableWithMergedCellInMacro = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'excerpt',
        parameters: {
          macroParams: {
            hidden: {
              value: 'false',
            },
          },
        },
        layout: 'default',
        localId: '2606e552-8462-4bb7-88ad-be53b39a3eed',
      },
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
                    rowspan: 2,
                    background: '#deebff',
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
                          text: 'ba',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    background: '#deebff',
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
                    background: '#deebff',
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
                    background: '#b3d4ff',
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
                    background: '#b3d4ff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
    },
  ],
};

export const fourByFourTable = {
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
                      text: 'ad',
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
                      text: 'bd',
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
                      text: 'cd',
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
                      text: 'da',
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
                      text: 'db',
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
                      text: 'dc',
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
                      text: 'dd',
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
export const fourByFourTableNestedInExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: 'Expand title',
      },
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
                          text: 'ad',
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
                          text: 'bd',
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
                          text: 'cd',
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
                          text: 'da',
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
                          text: 'db',
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
                          text: 'dc',
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
                          text: 'dd',
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
    },
  ],
};
export const fourByFourTableNestedInMacro = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'excerpt',
        parameters: {
          macroParams: {
            hidden: {
              value: 'false',
            },
          },
        },
        layout: 'default',
        localId: '2606e552-8462-4bb7-88ad-be53b39a3eed',
      },
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
                          text: 'ad',
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
                          text: 'bd',
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
                          text: 'cd',
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
                          text: 'da',
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
                          text: 'db',
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
                          text: 'dc',
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
                          text: 'dd',
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
    },
  ],
};

/*
table with 3 columns and 25 rows
first 3 rows with texts, last 2 rows with texts, rest 20 rows all empty
| aa | ab | ac |
| ba | bb | bc |
| ca | cb | cc |
......
|xa | xb | xc |
|ya | yb | yc |
*/

export const tableWithVerticalScroll = {
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
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
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
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
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
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
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
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
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
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',

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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'xa',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'xb',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'xc',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ya',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'yb',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',

              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'yc',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    { type: 'paragraph', content: [{ type: 'text', text: 'Bottom' }] },
  ],
};

const expectedTableWithVerticalScrollForRow = table({
  isNumberColumnEnabled: false,
  layout: 'default',
  localId: 'abc-123',
  // @ts-ignore
  width: null,
})(
  tr(th()(p(strong('aa'))), th()(p(strong('ab'))), th()(p(strong('ac')))),
  tr(td()(p('ba')), td()(p('bb')), td()(p('bc'))),
  tr(td()(p('ca')), td()(p('cb')), td()(p('cc'))),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(td()(p('xa')), td()(p('xb')), td()(p('xc'))),
  tr(td()(p('ya')), td()(p('yb')), td()(p('yc'))),
);
const expectedTableWithVerticalScrollForColumn = table({
  isNumberColumnEnabled: false,
  layout: 'default',
  localId: 'abc-123',
  // @ts-ignore
  width: null,
})(
  tr(th()(p(strong('ab'))), th()(p(strong('aa'))), th()(p(strong('ac')))),
  tr(td()(p('bb')), td()(p('ba')), td()(p('bc'))),
  tr(td()(p('cb')), td()(p('ca')), td()(p('cc'))),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(td()(p('xb')), td()(p('xa')), td()(p('xc'))),
  tr(td()(p('yb')), td()(p('ya')), td()(p('yc'))),
);

export const expectedDocTableWithVerticalScrollForRow = doc(
  expectedTableWithVerticalScrollForRow,
  p('Bottom'),
);
export const expectedDocTableWithVerticalScrollForColumn = doc(
  expectedTableWithVerticalScrollForColumn,
  p('Bottom'),
);

const expectedSimpleTableForRow = table({
  isNumberColumnEnabled: false,
  layout: 'default',
  localId: 'abc-123',
  // @ts-ignore
  width: null,
})(
  tr(
    th({ background: '#ffffff' })(p('ba')),
    th({ background: '#ffffff' })(p('bb')),
    th({ background: '#ffffff' })(p('bc')),
  ),
  tr(
    td({ background: '#ffffff' })(p(strong('aa'))),
    td({ background: '#ffffff' })(p(strong('ab'))),
    td({ background: '#ffffff' })(p(strong('ac'))),
  ),
  tr(
    td({ background: '#ffffff' })(p('ca')),
    td({ background: '#ffffff' })(p('cb')),
    td({ background: '#ffffff' })(p('cc')),
  ),
);

export const expectedDocSimpleTableForRow = doc(expectedSimpleTableForRow, p());
export const expectedDocSimpleTableForRowInExpand = doc(
  expand({ title: 'Expand title' })(expectedSimpleTableForRow, p()),
);
export const expectedDocSimpleTableForRowInMacro = doc(
  bodiedExtension({
    extensionType: 'com.atlassian.confluence.macro.core',
    extensionKey: 'excerpt',
    layout: 'default',
    localId: 'testId',
    parameters: {
      macroParams: {
        hidden: {
          value: 'false',
        },
      },
    },
  })(expectedSimpleTableForRow, p()),
);

const expectedSimpleTableForColumn = table({
  isNumberColumnEnabled: false,
  layout: 'default',
})(
  tr(
    th({ background: '#ffffff' })(p(strong('ab'))),
    th({ background: '#ffffff' })(p(strong('aa'))),
    th({ background: '#ffffff' })(p(strong('ac'))),
  ),
  tr(
    td({ background: '#ffffff' })(p('bb')),
    td({ background: '#ffffff' })(p('ba')),
    td({ background: '#ffffff' })(p('bc')),
  ),
  tr(
    td({ background: '#ffffff' })(p('cb')),
    td({ background: '#ffffff' })(p('ca')),
    td({ background: '#ffffff' })(p('cc')),
  ),
);

export const expectedDocSimpleTableForColumn = doc(
  expectedSimpleTableForColumn,
  p(),
);

export const expectedDocSimpleTableForColumnInExpand = doc(
  expand({ title: 'Expand title' })(expectedSimpleTableForColumn, p()),
);

export const expectedDocSimpleTableForColumnInMacro = doc(
  bodiedExtension({
    extensionType: 'com.atlassian.confluence.macro.core',
    extensionKey: 'excerpt',
    layout: 'default',
    localId: 'testId',
    parameters: {
      macroParams: {
        hidden: {
          value: 'false',
        },
      },
    },
  })(expectedSimpleTableForColumn, p()),
);

const expectedFourByFourTableForRow = table({
  isNumberColumnEnabled: false,
  layout: 'default',
  localId: 'abc-123',
  // @ts-ignore
  width: null,
})(
  tr(
    th({ background: '#ffffff' })(p(strong('aa'))),
    th({ background: '#ffffff' })(p(strong('ab'))),
    th({ background: '#ffffff' })(p(strong('ac'))),
    th({ background: '#ffffff' })(p(strong('ad'))),
  ),
  tr(
    td({ background: '#ffffff' })(p('ca')),
    td({ background: '#ffffff' })(p('cb')),
    td({ background: '#ffffff' })(p('cc')),
    td({ background: '#ffffff' })(p('cd')),
  ),
  tr(
    td({ background: '#ffffff' })(p('da')),
    td({ background: '#ffffff' })(p('db')),
    td({ background: '#ffffff' })(p('dc')),
    td({ background: '#ffffff' })(p('dd')),
  ),
  tr(
    td({ background: '#ffffff' })(p('ba')),
    td({ background: '#ffffff' })(p('bb')),
    td({ background: '#ffffff' })(p('bc')),
    td({ background: '#ffffff' })(p('bd')),
  ),
);

export const expectedDocFourByFourTableForRow = doc(
  expectedFourByFourTableForRow,
  p(),
);
export const expectedDocFourByFourTableForRowInExpand = doc(
  expand({ title: 'Expand title' })(expectedFourByFourTableForRow, p()),
);
export const expectedDocFourByFourTableForRowInMacro = doc(
  bodiedExtension({
    extensionType: 'com.atlassian.confluence.macro.core',
    extensionKey: 'excerpt',
    layout: 'default',
    localId: 'testId',
    parameters: {
      macroParams: {
        hidden: {
          value: 'false',
        },
      },
    },
  })(expectedFourByFourTableForRow, p()),
);

const expectedFourByFourTableForColumn = table({
  isNumberColumnEnabled: false,
  layout: 'default',
  localId: 'abc-123',
  // @ts-ignore
  width: null,
})(
  tr(
    th({ background: '#ffffff' })(p(strong('aa'))),
    th({ background: '#ffffff' })(p(strong('ac'))),
    th({ background: '#ffffff' })(p(strong('ad'))),
    th({ background: '#ffffff' })(p(strong('ab'))),
  ),
  tr(
    td({ background: '#ffffff' })(p('ba')),
    td({ background: '#ffffff' })(p('bc')),
    td({ background: '#ffffff' })(p('bd')),
    td({ background: '#ffffff' })(p('bb')),
  ),
  tr(
    td({ background: '#ffffff' })(p('ca')),
    td({ background: '#ffffff' })(p('cc')),
    td({ background: '#ffffff' })(p('cd')),
    td({ background: '#ffffff' })(p('cb')),
  ),
  tr(
    td({ background: '#ffffff' })(p('da')),
    td({ background: '#ffffff' })(p('dc')),
    td({ background: '#ffffff' })(p('dd')),
    td({ background: '#ffffff' })(p('db')),
  ),
);

export const expectedDocFourByFourTableForColumn = doc(
  expectedFourByFourTableForColumn,
  p(),
);

export const expectedDocFourByFourTableForColumnInExpand = doc(
  expand({ title: 'Expand title' })(expectedFourByFourTableForColumn, p()),
);

export const expectedDocFourByFourTableForColumnInMacro = doc(
  bodiedExtension({
    extensionType: 'com.atlassian.confluence.macro.core',
    extensionKey: 'excerpt',
    layout: 'default',
    localId: 'testId',
    parameters: {
      macroParams: {
        hidden: {
          value: 'false',
        },
      },
    },
  })(expectedFourByFourTableForColumn, p()),
);

export const simpleTableWithMergedCellNotInFirstRow = {
  version: 1,
  type: 'doc',
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
                background: '#deebff',
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
                background: '#deebff',
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
                background: '#deebff',
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
                colspan: 2,
                background: '#b3d4ff',
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
                background: '#b3d4ff',
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
                background: '#4c9aff',
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
                background: '#4c9aff',
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
                background: '#4c9aff',
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

export const simpleTableWithMergedCellNotInFirstRowInExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: 'Expand title',
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
                    background: '#deebff',
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
                    background: '#deebff',
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
                    background: '#deebff',
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
                    colspan: 2,
                    background: '#b3d4ff',
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
                    background: '#b3d4ff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
    },
  ],
};

export const simpleTableWithMergedCellNotInFirstRowInExtension = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'excerpt',
        parameters: {
          macroParams: {
            hidden: {
              value: 'false',
            },
          },
        },
        layout: 'default',
        localId: 'testId',
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
                    background: '#deebff',
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
                    background: '#deebff',
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
                    background: '#deebff',
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
                    colspan: 2,
                    background: '#b3d4ff',
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
                    background: '#b3d4ff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
                    background: '#4c9aff',
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
    },
  ],
};
