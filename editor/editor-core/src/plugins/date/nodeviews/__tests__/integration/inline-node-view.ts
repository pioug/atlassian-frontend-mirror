import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';
import { date } from '@atlaskit/editor-test-helpers/doc-builder';

runInlineNodeViewTestSuite({
  nodeName: 'date',
  editorOptions: { allowDate: true },
  node: date({
    timestamp: `${new Date('2020-01-01').getTime()}`,
  }),
  multiLineNode: true,
});
