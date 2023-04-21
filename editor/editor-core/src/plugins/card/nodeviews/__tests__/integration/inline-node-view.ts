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
    // FIXME: This test was automatically skipped due to failure on 20/04/2023: https://product-fabric.atlassian.net/browse/ED-17544,
    'Can select [target] nodes with the left arrow key and move across them': [
      '*',
    ],
  },
});
