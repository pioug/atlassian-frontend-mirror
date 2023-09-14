// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

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
