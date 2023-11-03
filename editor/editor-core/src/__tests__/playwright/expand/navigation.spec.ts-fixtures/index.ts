export const collapsedExpandAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: '',
        __expanded: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const expandAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: '',
        __expanded: true,
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const multiLineExpandAdf = {
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
          content: [
            {
              type: 'text',
              text: 'one',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'two',
            },
          ],
        },
      ],
    },
  ],
};

export const expandWithNestedCodeBlockTallAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: '',
        __expanded: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {},
      content: [
        {
          type: 'text',
          text: '\n\n\n\n\n\n\n',
        },
      ],
    },
    {
      type: 'expand',
      attrs: {
        title: '',
        __expanded: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const expandWithNestedPanelAdf = {
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
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const expandWithNestedCodeBlockAdf = {
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
          type: 'codeBlock',
          attrs: {},
        },
      ],
    },
  ],
};

export const doubleCollapsedExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'ABC',
        },
      ],
    },
    {
      type: 'expand',
      attrs: {
        title: 'First title',
        __expanded: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'expand',
      attrs: {
        title: '',
        __expanded: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
