import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
import { runBlockNodeSelectionTestSuite } from '../../../../__tests__/integration/selection/_blockNodeSelectionTestSuite';
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
  skipTests: {
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right': [
      'chrome',
    ],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left': [
      'chrome',
    ],
    'Extend selection up one line to select [block-node] with shift + arrow up': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Extend selection down one line to select [block-node] with shift + arrow down': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Extend a selection from end of the document to the start when [block-node] is the first node': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node': [
      'safari',
      'chrome',
      'firefox',
    ],
    'Click and drag from start of the document to select [block-node] when [block-node] is the last node': [
      'safari',
      'chrome',
      'firefox',
    ],
    "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down": [
      'safari',
      'chrome',
      'firefox',
    ],
  },
});

// helper function to collapse all expands being tested
const customBeforeEach = async (page: WebDriverPage): Promise<void> => {
  const toggleExpandButtons = await page.$$(
    '.ak-editor-expand__icon-container',
  );
  toggleExpandButtons.forEach((element: WebdriverIO.Element) => {
    element.click();
  });
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
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right': [
      'chrome',
    ],
    'Extend selection left two characters to select [block-node] from line below with shift + arrow left': [
      'chrome',
    ],
    'Extend selection down one line to select [block-node] with shift + arrow down': [
      'firefox',
    ],
    'Extend selection up one line to select [block-node] with shift + arrow up': [
      'firefox',
    ],
    'Extend a selection from end of the document to the start when [block-node] is the first node': [
      'chrome',
      'firefox',
      'safari',
    ],
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node': [
      'chrome',
      'firefox',
      'safari',
    ],
    'Extend a selection to the end of the document from start when [block-node] is the last node': [
      'chrome',
      'safari',
    ],
    'Click and drag from start of the document to select [block-node] when [block-node] is the last node': [
      'chrome',
      'firefox',
      'safari',
    ],
    "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down": [
      'chrome',
      'firefox',
      'safari',
    ],
  },
});
