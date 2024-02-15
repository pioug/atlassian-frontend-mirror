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

export const adfMBEWithTextBeforeAndAfter = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'before',
        },
      ],
    },
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
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'after',
        },
      ],
    },
  ],
};

export const adfWithSingleTab = {
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
                  text: 'Test',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const adfWithInlineCard = {
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
                  type: 'inlineCard',
                  attrs: {
                    url: 'https://inlineCardTestUrl',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const adfWithEmptyParagraphAbove = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
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
                  type: 'inlineCard',
                  attrs: {
                    url: 'https://inlineCardTestUrl',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
