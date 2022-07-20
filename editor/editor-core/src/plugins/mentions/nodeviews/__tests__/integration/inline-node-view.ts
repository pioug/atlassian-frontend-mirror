import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

runInlineNodeViewTestSuite({
  nodeName: 'mention',
  editorOptions: { allowMention: true },
  node: {
    type: 'mention',
    attrs: {
      id: '0',
      text: '@Carolyn',
      accessLevel: '',
    },
  },
  multiLineNode: true,
  skipTests: {
    'Extend a selection to the end of the current line from the current position': [
      'firefox',
    ],
    'No trailing spaces: Can move the selection up one line using up arrow key when [target] is the first node of each line': [
      'firefox',
    ],
  },
});
