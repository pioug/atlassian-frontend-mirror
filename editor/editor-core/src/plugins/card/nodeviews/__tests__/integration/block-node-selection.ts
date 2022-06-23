import { runBlockNodeSelectionTestSuite } from '../../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
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
    '[block-node] Should not prevent extending a selection to the start of the document from the end of the document': [
      'firefox',
    ],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right': [
      'chrome',
    ],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left': [
      'safari',
      'chrome',
    ],
    'Extend a selection from end of the document to the start when [block-node] is the first node': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Extend a selection to the end of the document from start when [block-node] is the last node': [
      'safari',
      'chrome',
      'firefox',
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
    'Click and drag from start to end of document and select [block-node]': [
      'safari',
    ],
    "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down": [
      'safari',
      'chrome',
      'firefox',
    ],
  },
});

runBlockNodeSelectionTestSuite({
  nodeName: 'embedCard',
  selector: '.embedCardView-content-wrap',
  editorOptions: {
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
  adfNode: {
    type: 'embedCard',
    attrs: {
      url: 'https://embedCardTestUrl',
      layout: 'center',
    },
  },

  skipTests: {
    'Click and drag from start to end of document and select [block-node]': [
      'safari',
      'firefox',
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
      'firefox',
    ],
    'Extend a selection to the end of the document from start when [block-node] is the last node': [
      'safari',
      'chrome',
      'firefox',
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
