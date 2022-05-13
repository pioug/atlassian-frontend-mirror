import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

runInlineNodeViewTestSuite({
  nodeName: 'emoji',
  node: {
    type: 'emoji',
    attrs: {
      shortName: ':grinning:',
      id: '1f600',
      text: '😀',
    },
  },
  multiLineNode: false,
});
