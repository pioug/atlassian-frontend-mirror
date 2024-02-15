/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { scrollToElement } from '@atlaskit/editor-test-helpers/page-objects/editor';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import bulletList99ItemsADF from './__fixtures__/bulletlist-99items.adf.json';
import listsWithCodeBlocksADF from './__fixtures__/lists-with-codeblocks.adf.json';

describe('Snapshot Test: lists', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  it('with codeblocks', async () => {
    await initEditorWithAdf(page, {
      adf: listsWithCodeBlocksADF,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 1000 },
    });
    await snapshot(page);
  });

  it('should not increase spacing left of bullets above 100 list items', async () => {
    await initEditorWithAdf(page, {
      adf: bulletList99ItemsADF,
      appearance: Appearance.fullPage,
      viewport: { width: 300, height: 200 },
    });
    await page.click('.ProseMirror ul > li:nth-child(99) > p');
    page.keyboard.press('Enter');
    await scrollToElement(page, '.ProseMirror ul > li:nth-child(100)');
    await page.mouse.move(0, 0);
    await snapshot(page);
  });
});
