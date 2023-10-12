import { runInlineNodeViewTestSuite } from '../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

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
  // FIXME: This test was automatically skipped due to failure on Tests sometimes flaking but work when tested manually in the browser
  skipTests: {
    'No trailing spaces: Can move the selection down one line using down arrow key when in between [target] nodes':
      ['firefox'],
    'No trailing spaces: Extend a selection to the start of the current line from the current position':
      ['firefox'],
  },
});
