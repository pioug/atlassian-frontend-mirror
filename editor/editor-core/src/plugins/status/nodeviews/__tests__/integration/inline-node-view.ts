import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

runInlineNodeViewTestSuite({
  nodeName: 'status',
  editorOptions: { allowStatus: true },
  node: {
    type: 'status',
    attrs: {
      text: 'test',
      color: 'neutral',
      localId: '756a705c-d938-4636-b417-7664d6d2da30',
      style: '',
    },
  },
  multiLineNode: false,
});
