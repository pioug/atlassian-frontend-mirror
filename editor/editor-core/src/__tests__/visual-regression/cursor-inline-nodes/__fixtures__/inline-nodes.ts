export const adfs: Record<string, Object> = {
  date: {
    version: 1,
    type: 'doc',
    content: [
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
                    type: 'date',
                    attrs: {
                      timestamp: '1616371200000',
                    },
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
                    text: 'LOL',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  emoji: {
    version: 1,
    type: 'doc',
    content: [
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
                    type: 'emoji',
                    attrs: {
                      shortName: ':smiley:',
                      id: '1f603',
                      text: '😃',
                    },
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
                    text: 'LOL',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  inlineExtension: {
    version: 1,
    type: 'doc',
    content: [
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
                    type: 'inlineExtension',
                    attrs: {
                      extensionType: 'com.atlassian.confluence.macro.core',
                      extensionKey: 'inline-eh',
                      parameters: {
                        macroParams: {},
                        macroMetadata: {
                          placeholder: [
                            {
                              data: {
                                url: '',
                              },
                              type: 'icon',
                            },
                          ],
                        },
                      },
                      text: 'Inline extension demo',
                    },
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
                    text: 'LOL',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  mention: {
    version: 1,
    type: 'doc',
    content: [
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
                    type: 'mention',
                    attrs: {
                      id: '0',
                      text: '@Carolyn',
                      accessLevel: '',
                      userType: null,
                    },
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
                    text: 'LOL',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  status: {
    version: 1,
    type: 'doc',
    content: [
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
                    type: 'status',
                    attrs: {
                      text: 'HELLO',
                      color: 'neutral',
                      localId: '556019ae-70e7-42b2-a213-8566efca769f',
                      style: '',
                    },
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
                    text: 'LOL',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
