/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  animationFrame,
  waitForElementOffset,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  clickOnStatus,
  insertStatusFromMenu,
  STATUS_SELECTORS,
  waitForStatusToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/status';
import {
  insertTaskFromMenu,
  ITEM_SELECTOR,
} from '@atlaskit/editor-test-helpers/page-objects/task';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import blank_adf from './__fixtures__/blank-adf.json';
import overflownStatusInsideTableAdf from './__fixtures__/overflow-status-inside-table.adf.json';
import adf from './__fixtures__/status-adf.json';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
describe.skip('Status:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  async function clickStatusAndWait() {
    await animationFrame(page);
    await clickOnStatus(page);
    await animationFrame(page);
    await waitForStatusToolbar(page);
    await animationFrame(page);
  }

  it('should display as selected', async () => {
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 300 },
    });
    await clickStatusAndWait();
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

    await page.waitForSelector(`${STATUS_SELECTORS.STATUS_POPUP_INPUT}:focus`, {
      visible: true,
    });

    await snapshot(page);
  });

  it('when overflown inside a table and selected', async () => {
    await initEditorWithAdf(page, {
      adf: overflownStatusInsideTableAdf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 400 },
    });
    await clickStatusAndWait();
    await page.click(STATUS_SELECTORS.STATUS_POPUP_INPUT);
    await waitForElementOffset(page, STATUS_SELECTORS.STATUS_POPUP_INPUT, {
      top: { min: 100, max: 300 },
      left: { min: 20, max: 150 },
    });
    await snapshot(page, undefined, undefined, {
      captureBeyondViewport: false,
    });
  });
});
