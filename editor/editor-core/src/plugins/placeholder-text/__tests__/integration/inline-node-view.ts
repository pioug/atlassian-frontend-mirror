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
    'Can click and drag to extend a selection to the start of the current line from the current position': [
      'safari',
    ],
    'Can select [target] nodes with the left arrow key and move across them': [
      'chrome',
      'firefox',
      'safari',
    ],
    'Can select [target] nodes with the right arrow key and move across them': [
      'chrome',
      'firefox',
      'safari',
    ],
    'No trailing spaces: Can click and drag to extend a selection to the start of the current line from the current position': [
      'chrome',
      'safari',
    ],
    'No trailing spaces: Can select [target] nodes with the left arrow key and move across them': [
      'chrome',
      'firefox',
      'safari',
    ],
    'No trailing spaces: Can select [target] nodes with the right arrow key and move across them': [
      'chrome',
      'firefox',
      'safari',
    ],
    'Multiline [target] no trailing spaces: Extend a selection to the start of the current line from the current position': [
      'safari',
    ],
    'No trailing spaces: Can extend the selection right by one with shift + right arrow key to select [target] node': [
      'chrome',
      'firefox',
      'safari',
    ],
    'No trailing spaces: Can extend the selection left by one with shift + left arrow key to select [target] node': [
      'firefox',
      'chrome',
      'safari',
    ],
    'No trailing spaces: Can move the selection down one line using down arrow key when in between [target] nodes': [
      'chrome',
      'firefox',
      'safari',
    ],
    'No trailing spaces: Can move the selection up one line using up arrow key when in between [target] nodes': [
      'chrome',
      'firefox',
      'safari',
    ],
    'No trailing spaces: Can move the selection down one line using down arrow key when [target] is the first node of each line': [
      'chrome',
      'firefox',
      'safari',
    ],
    'No trailing spaces: Can move the selection up one line using up arrow key when [target] is the first node of each line': [
      'chrome',
      'firefox',
      'safari',
    ],
  },
});
