import { runBlockNodeSelectionTestSuite } from '../../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';

import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';

// helper function to collapse all expands being tested
const customBeforeEach = async (page: WebDriverPage): Promise<void> => {
  const toggleExpandButtons = await page.$$(
    '.ak-editor-expand__icon-container',
  );
  for (let i = 0; i < toggleExpandButtons.length; i++) {
    const element = toggleExpandButtons[i];
    await element.click();
  }
};

runBlockNodeSelectionTestSuite({
  nodeName: 'expand',
  editorOptions: { allowExpand: true },
  adfNode: {
    type: 'expand',
    attrs: {
      title: '',
    },
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
  customBeforeEach,
  skipTests: {
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      [
        /* Drag and drop selection with Expand (collpased) is not stable enough to allow us to trust on integration tests */
        'firefox',
        'chrome',
        'safari',
      ],
    'Click and drag from start to end of document and select [block-node]': [
      'firefox',
    ],
    'Extend selection up one line to select [block-node] with shift + arrow up':
      ['firefox'],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['firefox'],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left':
      ['firefox', 'chrome', 'safari'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['firefox', 'chrome', 'safari'],
  },
});
