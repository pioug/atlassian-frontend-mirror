export const adfMediaSingleWithLinkInALayoutColumn = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
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
              type: 'mediaSingle',
              attrs: {
                layout: 'center',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    width: 500,
                    height: 500,
                  },
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://gnu.org',
                      },
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

export const adfMediaSingleWithLinkInAListItem = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
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
                  text: 'Um',
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
                  text: 'Dois',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
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
                    id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    width: 500,
                    height: 500,
                  },
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://gnu.org',
                      },
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
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Tres',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
export const adfMediaSingleWithLinkInANestedExpand = {
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
        title: '',
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
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'nestedExpand',
                      attrs: {
                        title: '',
                      },
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
                                id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                                type: 'file',
                                collection: 'MediaServicesSample',
                                width: 500,
                                height: 500,
                              },
                              marks: [
                                {
                                  type: 'link',
                                  attrs: {
                                    href: 'https://gnu.org',
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
            },
          ],
        },
      ],
    },
  ],
};
export const adfMediaSingleWithLinkInATable = {
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
                        id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                        type: 'file',
                        collection: 'MediaServicesSample',
                        width: 500,
                        height: 500,
                      },
                      marks: [
                        {
                          type: 'link',
                          attrs: {
                            href: 'https://gnu.org',
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
    },
  ],
};
export const adfMediaSingleWithLinkInAnExpand = {
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
        title: '',
      },
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
                id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                type: 'file',
                collection: 'MediaServicesSample',
                width: 500,
                height: 500,
              },
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://gnu.org',
                  },
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
export const adfMediaSingleWithLinkMarkInABodiedExtension = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'expand',
        localId: 'testId',
      },
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
                id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                type: 'file',
                collection: 'MediaServicesSample',
                width: 500,
                height: 500,
              },
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://gnu.org',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
