import { runInlineNodeViewTestSuite } from '../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

runInlineNodeViewTestSuite({
  nodeName: 'placeholder',
  editorOptions: {
    allowTemplatePlaceholders: {
      allowInserting: true,
    },
  },
  node: {
    type: 'placeholder',
    attrs: {
      text: 'test',
    },
  },
  multiLineNode: true,
  skipTests: {
    'Can click and drag to extend a selection to the start of the current line from the current position':
      ['safari', 'chrome', 'firefox'],
    'No trailing spaces: Can click and drag to extend a selection to the start of the current line from the current position':
      ['safari', 'chrome', 'firefox'],
    'No trailing spaces: Can move the selection down one line using down arrow key when in between [target] nodes':
      ['firefox'],
    'No trailing spaces: Can move the selection up one line using up arrow key when in between [target] nodes':
      ['firefox'],
    'No trailing spaces: Can move the selection down one line using down arrow key when [target] is the first node of each line':
      ['firefox'],
    'No trailing spaces: Can move the selection up one line using up arrow key when [target] is the first node of each line':
      ['firefox'],
  },
});
