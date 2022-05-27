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
    // TODO: Unskip via https://product-fabric.atlassian.net/browse/ED-15079
    'Multiline [target] no trailing spaces: Extend a selection to the start of the current line from the current position': [
      'firefox',
    ],
    'Extend a selection to the end of the current line from the current position': [
      'firefox',
    ],
  },
});
