import { runInlineNodeViewTestSuite } from '../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

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
  // FIXME: This test was automatically skipped due to failure on
  skipTests: {
    'Can click and drag to extend a selection to the start of the current line from the current position':
      ['safari', 'chrome', 'firefox'],

    // TODO: ED-13910 Unblock prosemirror upgrade
    // Placeholder test are working on the Firefox webdriver version
    'Can select [target] nodes with the left arrow key and move across them': [
      'firefox',
    ],
    'Can select [target] nodes with the right arrow key and move across them': [
      'firefox',
    ],
    'No trailing spaces: Can select [target] nodes with the right arrow key and move across them':
      ['firefox'],
    'No trailing spaces: Can extend the selection one line up with shift + arrow up':
      ['firefox'],
    'No trailing spaces: Can extend the selection one line down with shift + arrow down':
      ['firefox'],

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
