// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

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
