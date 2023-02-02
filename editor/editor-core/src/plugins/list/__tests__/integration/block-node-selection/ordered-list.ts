import { runBlockNodeSelectionTestSuite } from '../../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
runBlockNodeSelectionTestSuite({
  nodeName: 'orderedList',
  editorOptions: { allowLists: true },
  selector: 'ol',
  adfNode: {
    type: 'orderedList',
    content: [
      {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      },
    ],
  },

  skipTests: {
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['*'],
  },
});
