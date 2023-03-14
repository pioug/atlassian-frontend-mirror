import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';
import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';

// helper function to wait for the iframe to load
const customBeforeEach = async (page: WebDriverPage): Promise<void> => {
  await page.waitForSelector('iframe[data-iframe-loaded="true"]');
};

runBlockNodeSelectionTestSuite({
  nodeName: 'embedCard',
  selector: '.embedCardView-content-wrap',
  customBeforeEach,
  editorOptions: {
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
  adfNode: {
    type: 'embedCard',
    attrs: {
      url: 'https://embedCardTestUrl',
      layout: 'center',
    },
  },

  skipTests: {
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      ['safari', 'firefox'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['safari'],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['safari'],
  },
});
