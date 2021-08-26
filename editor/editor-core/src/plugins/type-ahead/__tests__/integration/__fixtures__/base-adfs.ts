export const onlyOneChar = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'C',
        },
      ],
    },
  ],
};

export const spaceAtEnd = {
  version: 1,
  type: 'doc',
  content: [
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
};

export const spaceBeforeText = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'a b',
        },
      ],
    },
  ],
};

export const textAndStatusAtFirstParagraph = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'AAA ',
        },
        {
          type: 'status',
          attrs: {
            text: 'CLICK ME',
            color: 'neutral',
            localId: 'local-id',
            style: '',
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
          text: ' ',
        },
      ],
    },
  ],
};
