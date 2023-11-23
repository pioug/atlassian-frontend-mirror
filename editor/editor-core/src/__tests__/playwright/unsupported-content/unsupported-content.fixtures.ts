export const unsupportedBlockAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'invalidNode',
      attrs: {
        panelType: 'info',
      },
      content: [],
    },
  ],
};

export const unsupportedInlineAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'invalidInline',
          text: 'hey there',
        },
      ],
    },
  ],
};
