import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

runInlineNodeViewTestSuite({
  nodeName: 'date',
  editorOptions: { allowDate: true },
  node: {
    type: 'date',
    attrs: {
      timestamp: `${new Date('2020-01-01').getTime()}`,
    },
  },
  multiLineNode: true,
});
