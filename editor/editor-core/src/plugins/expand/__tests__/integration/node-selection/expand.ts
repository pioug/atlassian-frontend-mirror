import { runBlockNodeSelectionTestSuite } from '../../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';

runBlockNodeSelectionTestSuite({
  nodeName: 'expand',
  editorOptions: { allowExpand: true },
  adfNode: {
    type: 'expand',
    attrs: {
      title: '',
    },
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
  skipTests: {},
});
