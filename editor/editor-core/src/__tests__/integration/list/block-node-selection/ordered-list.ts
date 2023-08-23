import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

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
});
