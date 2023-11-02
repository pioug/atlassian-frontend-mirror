// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'layout',
  selector: 'div[data-layout-section="true"]',
  editorOptions: { allowLayouts: true },
  adfNode: {
    type: 'layoutSection',
    content: [
      {
        type: 'layoutColumn',
        attrs: {
          width: 100,
        },
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '',
              },
            ],
          },
        ],
      },
    ],
  },
  skipTests: {},
});
