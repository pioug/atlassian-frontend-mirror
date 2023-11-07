// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'codeBlock',
  editorOptions: { allowCodeBlock: true },
  selector: '.code-block',
  adfNode: {
    type: 'codeBlock',
    attrs: {},
  },

  skipTests: {
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left':
      ['chrome', 'safari'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['safari', 'chrome'],
  },
});
