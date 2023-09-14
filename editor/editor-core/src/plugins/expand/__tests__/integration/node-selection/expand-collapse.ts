// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';
import type { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';

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
        /* Drag and drop selection with Expand (collapsed) is not stable enough to allow us to trust on integration tests */
        'firefox',
        'chrome',
        'safari',
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
