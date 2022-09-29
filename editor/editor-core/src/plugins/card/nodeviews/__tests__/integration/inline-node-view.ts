import { runInlineNodeViewTestSuite } from '../../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';

const customBeforeEach = async (page: WebDriverPage) => {
  await waitForResolvedInlineCard(page);
};

runInlineNodeViewTestSuite({
  nodeName: 'inlineCard',
  editorOptions: {
    smartLinks: {},
  },
  node: {
    type: 'inlineCard',
    attrs: {
      url: 'https://inlineCardTestUrl',
    },
  },
  multiLineNode: true,
  customBeforeEach,
  skipTests: {
    'Multiline [target] no trailing spaces: Extend a selection to the start of the current line from the current position': [
      'firefox',
    ],
  },
});
