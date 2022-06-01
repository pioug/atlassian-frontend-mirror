import { runBlockNodeSelectionTestSuite } from '../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
runBlockNodeSelectionTestSuite({
  nodeName: 'codeBlock',
  editorOptions: { allowCodeBlock: true },
  selector: '.code-block',
  adfNode: {
    type: 'codeBlock',
    attrs: {},
  },

  skipTests: {
    'Extend selection down one line to select [block-node] with shift + arrow down': [
      'safari',
      'chrome',
    ],
    'Extend selection up one line to select [block-node] with shift + arrow up': [
      'safari',
      'chrome',
    ],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right': [
      'chrome',
    ],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left': [
      'chrome',
    ],
    'Extend a selection from end of the document to the start when [block-node] is the first node': [
      'safari',
      'chrome',
    ],
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Click and drag from start of the document to select [block-node] when [block-node] is the last node': [
      'safari',
      'chrome',
      'firefox',
    ],
    "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down": [
      'safari',
      'chrome',
      'firefox',
    ],
  },
});
