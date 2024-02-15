import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table';

snapshotInformational(IssueLikeTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page
      .getByTestId('link-datasource-render-type--link')
      .getByText('DONUT-11720')
      .first()
      .hover();
    await page.waitForSelector('[data-testid="smart-links-container"]');
  },
  drawsOutsideBounds: true,
  description: 'issue like table hovering over key link',
});
