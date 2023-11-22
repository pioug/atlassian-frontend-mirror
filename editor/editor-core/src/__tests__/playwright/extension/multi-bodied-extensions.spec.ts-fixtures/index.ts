export const adfWithMBE = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'multiBodiedExtension',
      attrs: {
        extensionKey: 'fake_tabs.com:fakeTabNode',
        extensionType: 'com.atlassian.confluence.',
        maxFrames: 5,
        parameters: {
          activeTabIndex: 0,
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
        layout: 'default',
      },
      content: [
        {
          type: 'extensionFrame',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'LOL TAB1',
                },
              ],
            },
          ],
        },
        {
          type: 'extensionFrame',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'LOL TAB2',
                },
              ],
            },
          ],
        },
        {
          type: 'extensionFrame',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'LOL TAB3',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
