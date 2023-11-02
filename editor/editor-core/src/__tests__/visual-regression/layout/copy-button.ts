import { _getCopyButtonTestSuite } from '../copy-button/_getCopyButtonTestSuite';

_getCopyButtonTestSuite({
  nodeName: 'Layout',
  editorOptions: {
    allowLayouts: true,
    defaultValue: {
      version: 1,
      type: 'doc',
      content: [
        {
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
                      text: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  nodeSelector: '[data-layout-content="true"]',
});
