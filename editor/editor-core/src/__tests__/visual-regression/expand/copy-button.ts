import { _getCopyButtonTestSuite } from '../../../../src/__tests__/visual-regression/copy-button/_getCopyButtonTestSuite';

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
