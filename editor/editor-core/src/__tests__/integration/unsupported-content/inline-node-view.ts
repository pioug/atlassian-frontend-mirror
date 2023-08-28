import { runInlineNodeViewTestSuite } from '../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

runInlineNodeViewTestSuite({
  nodeName: 'unsupportedInline',
  node: {
    type: 'unsupportedInline',
    attrs: {
      text: 'test',
    },
  },
  multiLineNode: false,
});
