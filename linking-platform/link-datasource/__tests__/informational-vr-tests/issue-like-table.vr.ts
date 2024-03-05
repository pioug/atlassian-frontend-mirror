// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table';

snapshotInformational(IssueLikeTable, {
  prepare: async (page: Page, component: Locator) => {
    await page
      .locator('[data-testid="column-picker-trigger-button"]')
      .first()
      .click();
  },
  drawsOutsideBounds: true,
});
