import { beforeEach, cy } from 'local-cypress';

import {
  blockSmartLinksTestCollection,
  embedSmartLinksTestCollection,
  fundamentalsTestCollection,
  inlineSmartLinksTestCollection,
  mediaTestCollection,
} from '@atlaskit/editor-common/in-product';

describe('Editor', () => {
  const smartLinkTestCaseOpts = {
    url: 'https://www.youtube.com/watch?v=y8OnoxKotPQ',
    ui: { publishButton: '[data-testid="publish-button"]' },
  };
  const mediaTestCaseOpts = {
    fixtures: ['files/corne-avocado.jpg'],
    ui: { publishButton: '[data-testid="publish-button"]' },
    runOnly: ['media-caption'],
  };

  beforeEach(() => {
    cy.navigateTo('editor', 'editor-core', 'full-page');
  });

  fundamentalsTestCollection({}).test(cy);
  inlineSmartLinksTestCollection(smartLinkTestCaseOpts).test(cy);
  blockSmartLinksTestCollection(smartLinkTestCaseOpts).test(cy);
  embedSmartLinksTestCollection(smartLinkTestCaseOpts).test(cy);
  mediaTestCollection(mediaTestCaseOpts).test(cy);
});
