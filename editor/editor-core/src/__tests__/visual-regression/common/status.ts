import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  clickOnStatus,
  waitForStatusToolbar,
  insertStatusFromMenu,
  STATUS_SELECTORS,
} from '../../__helpers/page-objects/_status';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import adf from './__fixtures__/status-adf.json';
import blank_adf from './__fixtures__/blank-adf.json';
import {
  insertTaskFromMenu,
  ITEM_SELECTOR,
} from '../../__helpers/page-objects/_task';

describe('Status:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('should display as selected', async () => {
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 300 },
    });
    await animationFrame(page);
    await clickOnStatus(page);
    await animationFrame(page);
    await waitForStatusToolbar(page);
    await animationFrame(page);
    await snapshot(page);
  });

  it('should insert status inside action item and keep focus on it', async () => {
    await initEditorWithAdf(page, {
      adf: blank_adf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 400 },
    });
    await insertTaskFromMenu(page);
    await page.waitForSelector(ITEM_SELECTOR);
    await insertStatusFromMenu(page);
    await page.waitForSelector(STATUS_SELECTORS.STATUS_NODE);
    await snapshot(page);
  });
});
