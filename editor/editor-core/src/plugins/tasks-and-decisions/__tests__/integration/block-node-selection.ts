import { runBlockNodeSelectionTestSuite } from '../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
runBlockNodeSelectionTestSuite({
  nodeName: 'decisions',
  selector: 'ol[data-node-type="decisionList"]',
  editorOptions: { allowTasksAndDecisions: true },
  adfNode: {
    type: 'decisionList',
    attrs: {
      localId: 'ff57a749-8b4b-4f5e-87e2-c726d66b9ac5',
    },
    content: [
      {
        type: 'decisionItem',
        attrs: {
          localId: '3b8855ca-ac64-474f-9001-ebcad4968eaf',
          state: 'DECIDED',
        },
      },
    ],
  },

  skipTests: {
    'Extend selection down one line to select [block-node] with shift + arrow down': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Extend selection up one line to select [block-node] with shift + arrow up': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right': [
      'safari',
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
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Extend a selection to the end of the document from start when [block-node] is the last node': [
      'safari',
      'chrome',
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
