import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'table',
  editorOptions: {
    allowTables: {
      advanced: true,
    },
  },
  selector: 'table',
  adfNode: {
    type: 'table',
    attrs: {
      isNumberColumnEnabled: false,
      layout: 'default',
      localId: '15804638-b946-4591-b64c-beffe5122733',
    },
    content: [
      {
        type: 'tableRow',
        content: [
          {
            type: 'tableHeader',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          {
            type: 'tableHeader',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          {
            type: 'tableHeader',
            attrs: {},
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
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          {
            type: 'tableCell',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          {
            type: 'tableCell',
            attrs: {},
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
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          {
            type: 'tableCell',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          {
            type: 'tableCell',
            attrs: {},
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
        ],
      },
    ],
  },
  skipTests: {
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right': [
      'chrome',
      'safari',
      'firefox',
    ],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left': [
      'chrome',
      'safari',
      'firefox',
    ],
    'Extend a selection from end of the document to the start when [block-node] is the first node': [
      'chrome',
      'safari',
      'firefox',
    ],
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node': [
      'chrome',
      'safari',
      'firefox',
    ],
    'Extend a selection to the end of the document from start when [block-node] is the last node': [
      'chrome',
      'safari',
      'firefox',
    ],
    'Click and drag from start of the document to select [block-node] when [block-node] is the last node': [
      'chrome',
      'safari',
      'firefox',
    ],
    "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down": [
      'chrome',
      'safari',
      'firefox',
    ],
  },
});
