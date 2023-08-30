export const singleInfoPanel = {
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
        },
      ],
    },
    {
      type: 'paragraph',
    },
  ],
  version: 1,
};

export const infoPanelWithTextBelowExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: '',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'first line in panel',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'second line in panel',
            },
          ],
        },
      ],
    },
  ],
};

export const infoPanelWithTextBelowLayout = {
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
              type: 'paragraph',
              content: [],
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
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'first line in panel',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'second line in panel',
            },
          ],
        },
      ],
    },
  ],
};

export const infoPanelWithTextBelowTable = {
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
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'first line in panel',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'second line in panel',
            },
          ],
        },
      ],
    },
  ],
};

export const infoPanelWithTextBelowParagraph = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'line above panel',
        },
      ],
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'first line in panel',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'second line in panel',
            },
          ],
        },
      ],
    },
  ],
};

export const singleCodeBlock = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'codeBlock',
      attrs: {},
    },
  ],
};
