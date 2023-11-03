// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'panel',
  editorOptions: { allowPanel: true },
  adfNode: {
    type: 'panel',
    attrs: {
      panelType: 'info',
    },
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
  skipTests: {
    'Extend selection down one line to select [block-node] with shift + arrow down':
      ['safari', 'chrome', 'firefox'],
    'Extend selection up one line to select [block-node] with shift + arrow up':
      ['safari', 'chrome', 'firefox'],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['safari', 'chrome', 'firefox'],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left':
      ['safari', 'chrome', 'firefox'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['safari', 'chrome', 'firefox'],
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      ['safari', 'chrome', 'firefox'],
    'Extend a selection to the end of the document from start when [block-node] is the last node':
      ['safari', 'chrome', 'firefox'],
    'Click and drag from start of the document to select [block-node] when [block-node] is the last node':
      ['safari', 'chrome', 'firefox'],
    "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down":
      ['safari', 'chrome', 'firefox'],
  },
});
