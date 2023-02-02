import { runBlockNodeSelectionTestSuite } from '../../../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
runBlockNodeSelectionTestSuite({
  nodeName: 'blockCard',
  selector: '.blockCardView-content-wrap',
  editorOptions: {
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
  adfNode: {
    type: 'blockCard',
    attrs: {
      url: 'https://inlineCardTestUrl',
    },
  },

  skipTests: {
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      ['safari'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['safari'],
    'Extend selection down one line to select [block-node] with shift + arrow down':
      ['safari'],
    'Extend selection up one line to select [block-node] with shift + arrow up':
      ['safari'],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['safari'],
  },
});
