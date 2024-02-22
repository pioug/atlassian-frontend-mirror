import type { DocNode } from '@atlaskit/adf-schema';

export const adfHeadingsNestedPanel: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'rule',
    },
    {
      type: 'panel',
      attrs: {
        // @ts-expect-error
        panelType: 'info',
      },
      content: [
        {
          type: 'heading',
          attrs: {
            level: 4,
          },
          content: [
            {
              type: 'text',
              text: 'Panel Heading',
            },
          ],
        },
      ],
    },
  ],
};

export const adfHeadingsNestedExpands: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Paragraph',
        },
      ],
    },
    {
      type: 'expand',
      attrs: {
        title: 'Expand A',
      },
      content: [
        {
          type: 'heading',
          attrs: {
            level: 1,
          },
          content: [
            {
              type: 'text',
              text: 'Heading 1',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Paragraph',
            },
          ],
        },
      ],
    },
    {
      type: 'expand',
      attrs: {
        title: 'Expand B',
      },
      content: [
        {
          type: 'heading',
          attrs: {
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Heading 2',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Paragraph',
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
              text: 'Heading 3',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Paragraph',
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
          text: 'Paragraph',
        },
      ],
    },
  ],
};

export const adfHeadingsInsideTable: DocNode = {
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
                  type: 'heading',
                  attrs: {
                    level: 4,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Table Heading 4',
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
                    level: 4,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Multiline heading that wraps',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Paragraph',
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
      ],
    },
  ],
};

export const adfHeadingsNestedLayout: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
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
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'LC Heading L',
                },
              ],
            },
            {
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'LC Heading C',
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
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'LC Heading R',
                },
              ],
              marks: [
                {
                  type: 'alignment',
                  attrs: {
                    align: 'end',
                  },
                },
              ],
            },
            {
              type: 'rule',
            },
            {
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'LC Heading R',
                },
              ],
              marks: [
                {
                  type: 'alignment',
                  attrs: {
                    align: 'end',
                  },
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
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'RC Heading L',
                },
              ],
            },
            {
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'RC Heading C',
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
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'RC Heading R',
                },
              ],
              marks: [
                {
                  type: 'alignment',
                  attrs: {
                    align: 'end',
                  },
                },
              ],
            },
            {
              type: 'rule',
            },
            {
              type: 'heading',
              attrs: {
                level: 4,
              },
              content: [
                {
                  type: 'text',
                  text: 'RC Heading R',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
