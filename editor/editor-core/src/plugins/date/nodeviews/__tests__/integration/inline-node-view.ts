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
  skipTests: {
    // FIXME: This test was automatically skipped due to failure on https://product-fabric.atlassian.net/browse/ED-17199
    'Can click and drag to extend a selection to the start of the current line from the current position':
      ['chrome', 'safari'],
  },
});
