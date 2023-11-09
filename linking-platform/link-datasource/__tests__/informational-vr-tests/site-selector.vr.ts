// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import SiteSelector from '../../examples/site-selector-vr';

snapshotInformational(SiteSelector, {
  prepare: async (page: Page, component: Locator) => {
    await page
      .locator('.jira-jql-datasource-modal--site-selector__control')
      .first()
      .click();
  },
  drawsOutsideBounds: true,
});
