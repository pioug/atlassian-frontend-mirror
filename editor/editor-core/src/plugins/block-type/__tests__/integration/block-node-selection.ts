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
  skipTests: {},
});
