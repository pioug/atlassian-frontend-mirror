export const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Trying to delete the below extension will result in a confirmation dialog, because it's being used as a data source for the extension at the bottom",
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId: a, ',
        },
        {
          type: 'text',
          text: 'b',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#0747a6',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: 'a',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'b',
            name: 'Test Name 1',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The below extension ⌄⌄⌄ contains a dataConsumer and is linked to the above extension ^',
        },
        {
          type: 'text',
          text: 'b',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#0747a6',
              },
            },
          ],
        },
        {
          type: 'text',
          text: '^ ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId: c, ',
        },
        {
          type: 'text',
          text: 'd',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#ff5630',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: 'a2b780dd-d728-42ac-8f30-141e270e467c',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'd',
            name: 'Test Name 2',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['b'],
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId: i, ',
        },
        {
          type: 'text',
          text: 'j',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#36b37e',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: '6ad375ea-69b7-4a53-8ac2-a1bd664b0103',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'j',
            name: 'Test Name 3',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['b'],
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId: q, ',
        },
        {
          type: 'text',
          text: 'q',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#36b37e',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: '6ad375ea-69b7-4a53-8ac2-a1bd664b0103',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'q',
            name: 'Test Name 4',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['b'],
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The below extension ⌄⌄⌄ contains a dataConsumer and is linked to the above extension ^',
        },
        {
          type: 'text',
          text: 'd',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#ff5630',
              },
            },
          ],
        },
        {
          type: 'text',
          text: '^ ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId: e, f',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: '32da6f01-125b-4478-a44e-1a726d299761',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'f',
            name: 'Test Name 5',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['d'],
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId: g, h',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: 'f0b4ff93-ce63-43d0-a0f7-0d58dbeb8165',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'h',
            name: 'Test Name 6',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['d'],
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The below extension ⌄⌄⌄ contains a dataConsumer and is linked to the above extension ^',
        },
        {
          type: 'text',
          text: 'j',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#36b37e',
              },
            },
          ],
        },
        {
          type: 'text',
          text: '^ ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId:k, l',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: '798c9668-08e1-460f-8d34-fb8e0e857687',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'l',
            name: 'Test Name 7',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['j'],
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'localId:m, n',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
        localId: 'b5ad6a78-50ee-4d94-96bb-59b6361088cc',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'n',
            name: 'Test Name 8',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['d'],
          },
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.forge',
        extensionKey: 'awesome:question',
        parameters: {},
        layout: 'default',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'z',
            name: 'Test Name 9',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['d'],
          },
        },
      ],
    },
  ],
};
