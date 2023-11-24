export const paragraphADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      ],
    },
  ],
};

export const paragraphEmojiADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Lorem ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':slight_smile:',
            id: '1f642',
            text: '🙂',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':slight_smile:',
            id: '1f642',
            text: '🙂',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':slight_smile:',
            id: '1f642',
            text: '🙂',
          },
        },
        {
          type: 'text',
          text: '  ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      ],
    },
  ],
};
