export const bodiedExtensionWithTextBeforeAndAfter = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'start',
        },
      ],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        layout: 'default',
        localId: '40ad9d08-ab53-438b-877e-f6a9dd0a401b',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'text',
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
          text: 'end',
        },
      ],
    },
  ],
};
