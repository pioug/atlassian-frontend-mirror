// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';

import { runInlineNodeViewTestSuite } from '../../../../nodeviews/__tests__/integration/_getInlineNodeViewProducerTestSuite';

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
    // FIXME: This test was automatically skipped due to failure on 28/05/2023: https://product-fabric.atlassian.net/browse/ED-18111
    'Extend a selection to the start of the current line from the current position':
      ['*'],
  },
});
