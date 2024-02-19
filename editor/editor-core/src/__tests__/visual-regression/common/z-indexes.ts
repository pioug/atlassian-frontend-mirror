/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
import {
  insertTable,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import {
  editorSelector,
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/noData-adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('z-indexes:', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await insertTable(page);
  });

  afterEach(async () => {
    await snapshot(page, undefined, editorSelector);
  });

  // Floating toolbar causes flakiness. Skipping for now. Need to restore once a solution exists
  // for toolbar centering.
  it('should always position table trash icon below dropdowns from main menu', async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await clickToolbarMenu(page, ToolbarMenuItem.insertBlock);
    await page.waitForSelector(selectors.dropList);
  });

  it('should always position table trash icon below emoji picker', async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await clickToolbarMenu(page, ToolbarMenuItem.emoji);
    await page.waitForSelector(selectors.emojiPicker);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
  });

  it('should always position table trash icon below mention picker', async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await clickToolbarMenu(page, ToolbarMenuItem.mention);
    await page.waitForSelector(selectors.mentionQuery);
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
  });
});
