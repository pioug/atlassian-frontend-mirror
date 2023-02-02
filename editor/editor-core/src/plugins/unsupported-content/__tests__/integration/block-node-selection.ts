import { runBlockNodeSelectionTestSuite } from '../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
runBlockNodeSelectionTestSuite({
  nodeName: 'unsupportedBlock',
  selector: '.unsupportedBlockView-content-wrap',
  adfNode: {
    type: 'invalidNode',
    attrs: {
      panelType: 'info',
    },
    content: [],
  },

  skipTests: {
    'Extend selection down one line to select [block-node] with shift + arrow down':
      ['*'],
    'Extend selection up one line to select [block-node] with shift + arrow up':
      ['*'],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['*'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['*'],
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      ['*'],
  },
});
