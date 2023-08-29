import { runInlineNodeViewTestSuite } from '../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';
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
  skipTests: {
    // FIXME: This test was automatically skipped due to failure on Works when manually tested but sometimes flaky
    'Extend a selection to the end of the current line from the current position':
      //['firefox'], // Skipped in ED-17195
      ['*'],

    // FIXME: This test was automatically skipped due to failure on 30/05/2023: https://product-fabric.atlassian.net/browse/ED-18132,
    'No trailing spaces: Can move the selection up one line using up arrow key when [target] is the first node of each line':
      ['*'],

    // FIXME: This test was automatically skipped for safari due to failure on Works when manually tested but sometimes flaky
    'No trailing spaces: Extend a selection to the end of the current line from the current position':
      ['safari'],
  },
});
