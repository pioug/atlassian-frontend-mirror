// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'bodiedExtension',
  selector: '.bodiedExtensionView-content-wrap',
  editorOptions: {
    allowExtension: true,
  },
  adfNode: {
    type: 'bodiedExtension',
    attrs: {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'expand',
    },
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },

  skipTests: {
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['firefox'],
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      ['firefox'],
  },
});
