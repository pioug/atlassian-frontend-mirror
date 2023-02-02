import { runBlockNodeSelectionTestSuite } from '../../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
runBlockNodeSelectionTestSuite({
  nodeName: 'bulletList',
  editorOptions: { allowLists: true },
  selector: 'ul',
  adfNode: {
    type: 'bulletList',
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
