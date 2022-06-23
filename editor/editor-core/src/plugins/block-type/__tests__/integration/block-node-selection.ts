import { runBlockNodeSelectionTestSuite } from '../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';

runBlockNodeSelectionTestSuite({
  nodeName: 'blockquote',
  selector: 'blockquote',
  adfNode: {
    type: 'blockquote',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
  skipTests: {
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node': [
      'safari',
    ],
    'Extend a selection from end of the document to the start when [block-node] is the first node': [
      'firefox',
    ],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left': [
      'firefox',
    ],
    '[block-node] Should not prevent extending a selection to the end of the document from the start of the document': [
      'firefox',
    ],
  },
});
