import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

runInlineNodeViewTestSuite({
  nodeName: 'mention',
  editorOptions: { allowMention: true },
  node: {
    type: 'mention',
    attrs: {
      id: '0',
      text: '@Carolyn',
      accessLevel: '',
    },
  },
  multiLineNode: true,
});
