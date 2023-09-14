/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  initFullPageEditorWithAdf,
  snapshot,
  editorSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { tableSelectors } from '@atlaskit/editor-test-helpers/page-objects/table';
import { insertTable } from '@atlaskit/editor-test-helpers/page-objects/table';
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
import adf from './__fixtures__/noData-adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('z-indexes:', () => {
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

  // https://product-fabric.atlassian.net/browse/ED-9705
  // Floating toolbar causes flakiness. Skipping for now. Need to restore once a solution exists
  // for toolbar centering.
  it.skip('should always position table trash icon below dropdowns from main menu', async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await clickToolbarMenu(page, ToolbarMenuItem.insertBlock);
    await page.waitForSelector(selectors.dropList);
  });

  it.skip('should always position table trash icon below emoji picker', async () => {
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
