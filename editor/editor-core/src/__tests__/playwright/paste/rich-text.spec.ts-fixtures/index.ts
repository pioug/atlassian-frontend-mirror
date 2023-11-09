export const emptyDocument = {
  version: 1,
  type: 'doc',
  content: [],
};

export const documentWithTable = {
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

export const documentWithListAndTable = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'a',
                },
              ],
            },
            {
              type: 'orderedList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'b',
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
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'c',
                },
              ],
            },
          ],
        },
      ],
    },
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

export const documentWithExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'expand',
      attrs: {
        title: 'title',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
  ],
};

export const documentWithExpandAndTables = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'expand',
      attrs: {
        title: 'Top level expand!',
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
  ],
};

export const tableWithPanel = {
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
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'panel',
                  attrs: {
                    panelType: 'info',
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
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
export const documentWithTextAndSimpleTable = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello',
        },
      ],
    },
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
                  content: [
                    {
                      type: 'text',
                      text: 'world',
                    },
                  ],
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

export const documentWithTextAndComplexTable = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello',
        },
      ],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'acb-123',
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
                  content: [
                    {
                      type: 'status',
                      attrs: {
                        text: 'some status',
                        color: 'neutral',
                        localId: 'def-456',
                        style: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                  marks: [
                    {
                      type: 'alignment',
                      attrs: {
                        align: 'center',
                      },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':grinning:',
                        id: '1f600',
                        text: '😀',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':disappointed:',
                        id: '1f61e',
                        text: '😞',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                  marks: [
                    {
                      type: 'alignment',
                      attrs: {
                        align: 'center',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: '1646870400000',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Some ',
                    },
                    {
                      type: 'text',
                      text: 'code',
                      marks: [
                        {
                          type: 'code',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      text: ' and ',
                    },
                    {
                      type: 'inlineCard',
                      attrs: {
                        data: {
                          '@context': 'https://www.w3.org/ns/activitystreams',
                          '@type': 'Document',
                          name: 'Welcome to Atlassian!',
                          url: 'http://www.atlassian.com',
                        },
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'heading',
                  attrs: {
                    level: 2,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'BIGGER',
                    },
                  ],
                },
                {
                  type: 'codeBlock',
                  attrs: {},
                  content: [
                    {
                      type: 'text',
                      text: 'some code',
                    },
                  ],
                },
                {
                  type: 'panel',
                  attrs: {
                    panelType: 'error',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'some panel!',
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
              attrs: {},
              content: [
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'more',
                              marks: [
                                {
                                  type: 'em',
                                },
                                {
                                  type: 'strong',
                                },
                                {
                                  type: 'underline',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'bulletList',
                          content: [
                            {
                              type: 'listItem',
                              content: [
                                {
                                  type: 'paragraph',
                                  content: [
                                    {
                                      type: 'text',
                                      text: 'other things',
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
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'things ',
                            },
                            {
                              type: 'status',
                              attrs: {
                                text: 'some status',
                                color: 'red',
                                localId: 'ghi-789',
                                style: '',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'nestedExpand',
                  attrs: {
                    title: 'expand title',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'some expand',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'taskList',
                  attrs: {
                    localId: 'jkl-123',
                  },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'mno-456',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'some action ',
                        },
                        {
                          type: 'date',
                          attrs: {
                            timestamp: '1646870400000',
                          },
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '0',
                        text: '@Carolyn',
                        accessLevel: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
                {
                  type: 'blockCard',
                  attrs: {
                    data: {
                      '@context': 'https://www.w3.org/ns/activitystreams',
                      '@type': 'Document',
                      name: 'Welcome to Atlassian!',
                      url: 'http://www.atlassian.com',
                    },
                  },
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'world',
                    },
                  ],
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

export const documentWithSimpleTableAndText = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
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
                  content: [
                    {
                      type: 'text',
                      text: 'hello',
                    },
                  ],
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
      content: [
        {
          type: 'text',
          text: 'world',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const documentWithComplexTableAndText = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'acb-123',
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
                  content: [
                    {
                      type: 'status',
                      attrs: {
                        text: 'some status',
                        color: 'neutral',
                        localId: 'def-456',
                        style: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                  marks: [
                    {
                      type: 'alignment',
                      attrs: {
                        align: 'center',
                      },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':grinning:',
                        id: '1f600',
                        text: '😀',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':disappointed:',
                        id: '1f61e',
                        text: '😞',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                  marks: [
                    {
                      type: 'alignment',
                      attrs: {
                        align: 'center',
                      },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [],
                  marks: [
                    {
                      type: 'alignment',
                      attrs: {
                        align: 'center',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: '1646870400000',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Some ',
                    },
                    {
                      type: 'text',
                      text: 'code',
                      marks: [
                        {
                          type: 'code',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      text: ' and ',
                    },
                    {
                      type: 'inlineCard',
                      attrs: {
                        data: {
                          '@context': 'https://www.w3.org/ns/activitystreams',
                          '@type': 'Document',
                          name: 'Welcome to Atlassian!',
                          url: 'http://www.atlassian.com',
                        },
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'heading',
                  attrs: {
                    level: 2,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'BIGGER',
                    },
                  ],
                },
                {
                  type: 'codeBlock',
                  attrs: {},
                  content: [
                    {
                      type: 'text',
                      text: 'some code',
                    },
                  ],
                },
                {
                  type: 'panel',
                  attrs: {
                    panelType: 'error',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'some panel!',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'hello',
                    },
                  ],
                  marks: [
                    {
                      type: 'alignment',
                      attrs: {
                        align: 'center',
                      },
                    },
                  ],
                },
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'more',
                              marks: [
                                {
                                  type: 'em',
                                },
                                {
                                  type: 'strong',
                                },
                                {
                                  type: 'underline',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'other things',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'things ',
                            },
                            {
                              type: 'status',
                              attrs: {
                                text: 'some status',
                                color: 'red',
                                localId: 'ghi-789',
                                style: '',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'nestedExpand',
                  attrs: {
                    title: 'expand title',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'some expand',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'taskList',
                  attrs: {
                    localId: 'jkl-123',
                  },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'mno-456',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'some action ',
                        },
                        {
                          type: 'date',
                          attrs: {
                            timestamp: '1646870400000',
                          },
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '0',
                        text: '@Carolyn',
                        accessLevel: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
                {
                  type: 'blockCard',
                  attrs: {
                    data: {
                      '@context': 'https://www.w3.org/ns/activitystreams',
                      '@type': 'Document',
                      name: 'Welcome to Atlassian!',
                      url: 'http://www.atlassian.com',
                    },
                  },
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
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
      content: [
        {
          type: 'text',
          text: 'world',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const documentWithParagraphsInTableCell = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: '756df56e-a3a8-4726-9f6e-bd26382b2d5c',
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
                  content: [
                    {
                      type: 'text',
                      text: 'paragraph1',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'paragraph2',
                    },
                  ],
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
