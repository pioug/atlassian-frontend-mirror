import { _getCopyButtonTestSuite } from '../../../../../src/__tests__/integration/copy-button/_getCopyButtonTestSuite';

_getCopyButtonTestSuite({
  nodeName: 'Expand',
  editorOptions: {
    allowExpand: true,
    defaultValue: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'expand',
          attrs: {
            title: 'title',
          },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'text' }],
            },
          ],
        },
      ],
    },
  },
  nodeSelector: '.ak-editor-expand__content',
});
