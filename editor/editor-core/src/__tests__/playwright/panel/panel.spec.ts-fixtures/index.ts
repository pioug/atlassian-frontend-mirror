export const infoPanelADF = {
  version: 1,
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
          content: [],
        },
      ],
    },
  ],
};

export const infoPanelADFWithContentsAbove = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'para 1',
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
          content: [],
        },
      ],
    },
  ],
};
