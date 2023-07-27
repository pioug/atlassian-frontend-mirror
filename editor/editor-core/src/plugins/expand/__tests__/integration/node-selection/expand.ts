import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'expand',
  editorOptions: { allowExpand: true },
  adfNode: {
    type: 'expand',
    attrs: {
      title: '',
    },
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
  skipTests: {
    // The below tests have been skipped because they seem to fail in Chrome when we enable text selection for expand macro button
    // https://product-fabric.atlassian.net/browse/COMMENTS-107
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      [
        /* Drag and drop selection with Expand is not stable enough to allow us to trust on integration tests */
        'chrome',
      ],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left':
      ['chrome'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['chrome'],
  },
});
