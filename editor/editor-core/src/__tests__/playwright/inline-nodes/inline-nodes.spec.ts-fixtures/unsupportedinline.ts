import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const trailingSpacesWithUnsupportedInline: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        { type: 'text', text: ' ' },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        { type: 'text', text: ' ' },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        { type: 'text', text: ' ' },
      ],
    },
  ],
};

export const noTrailingSpacesWithUnsupportedInline: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
      ],
    },
  ],
};

export const multipleNodesAcrossLinesWithUnsupportedInline: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
        {
          type: 'unsupportedInline',
          attrs: {
            text: 'test',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const multilineWithUnsupportedInline: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: '704b4aa7-f9a6-49e0-9b14-3c2e010bd4ca',
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [56],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'unsupportedInline',
                      attrs: {
                        text: 'test',
                      },
                    },
                    {
                      type: 'unsupportedInline',
                      attrs: {
                        text: 'test',
                      },
                    },
                    {
                      type: 'unsupportedInline',
                      attrs: {
                        text: 'test',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [346],
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
                colwidth: [276],
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
                colwidth: [56],
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
                colwidth: [346],
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
                colwidth: [276],
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
};
