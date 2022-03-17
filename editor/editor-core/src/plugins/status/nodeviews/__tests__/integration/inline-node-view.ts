import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';
import { status } from '@atlaskit/editor-test-helpers/doc-builder';

runInlineNodeViewTestSuite({
  nodeName: 'status',
  editorOptions: { allowStatus: true },
  node: status({
    text: 'ABC',
    color: 'blue',
    localId: '040fe0df-dd11-45ab-bc0c-8220c814f716',
  }),
  multiLineNode: false,
});
