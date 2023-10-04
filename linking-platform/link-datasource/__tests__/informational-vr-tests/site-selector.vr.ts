import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import SiteSelector from '../../examples/site-selector-vr';

snapshotInformational(SiteSelector, {
  prepare: async (page: Page, component: Locator) => {
    await page
      .getByTestId('jira-jql-datasource-modal--site-selector--trigger')
      .click();
  },
  drawsOutsideBounds: true,
});
