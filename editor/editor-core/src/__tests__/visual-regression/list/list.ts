import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  snapshot,
  Appearance,
  initEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import listsWithCodeBlocksADF from './__fixtures__/lists-with-codeblocks.adf.json';

describe('Snapshot Test: lists', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  // this test passed locally,  but fail is CI
  it.skip('with codeblocks', async () => {
    await initEditorWithAdf(page, {
      adf: listsWithCodeBlocksADF,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 1000 },
    });
    await snapshot(page);
  });
});
