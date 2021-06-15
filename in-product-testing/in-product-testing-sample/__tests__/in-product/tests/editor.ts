import { before, cy } from 'local-cypress';

import { editorFundamentalsTestCollection } from '@atlaskit/editor-common/in-product';

describe('Editor', () => {
  before(() => {
    cy.navigateTo('editor', 'editor-core', 'full-page');
  });

  editorFundamentalsTestCollection({}).test(cy);
});
