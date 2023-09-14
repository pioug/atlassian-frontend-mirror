// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'rule',
  selector: 'hr',
  editorOptions: { allowRule: true },
  adfNode: {
    type: 'rule',
  },
  skipTests: {
    'Extend selection down one line to select [block-node] with shift + arrow down':
      ['*'],
    'Extend selection up one line to select [block-node] with shift + arrow up':
      ['*'],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['*'],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left':
      ['*'],
  },
});
