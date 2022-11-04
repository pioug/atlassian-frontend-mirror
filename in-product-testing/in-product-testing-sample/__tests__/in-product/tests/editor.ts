import {
  blockSmartLinksTestCollection,
  embedSmartLinksTestCollection,
  fundamentalsTestCollection,
  inlineSmartLinksTestCollection,
} from '@atlaskit/editor-common/in-product';

describe('Editor', () => {
  const smartLinkTestCaseOpts = {
    url: 'https://www.youtube.com/watch?v=y8OnoxKotPQ',
    ui: { publishButton: '[data-testid="publish-button"]' },
  };

  beforeEach(() => {
    cy.navigateTo('editor', 'editor-core', 'full-page');
  });

  fundamentalsTestCollection({}).test(cy);
  inlineSmartLinksTestCollection(smartLinkTestCaseOpts).test(cy);
  blockSmartLinksTestCollection(smartLinkTestCaseOpts).test(cy);
  embedSmartLinksTestCollection(smartLinkTestCaseOpts).test(cy);
});
