import { runBlockNodeSelectionTestSuite } from '../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
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
