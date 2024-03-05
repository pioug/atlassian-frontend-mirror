// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table';

snapshotInformational(IssueLikeTable, {
  description: 'drag column',
  prepare: async (page: Page, component: Locator) => {
    const source = await page
      .locator('[data-testid="type-column-heading"]')
      .first();
    const target = await page
      .locator(
        '[data-testid="priority-column-heading"] [data-testid="column-drop-target"]',
      )
      .first();

    await source.dragTo(target, {
      force: true,
      sourcePosition: { x: 0, y: 0 },
    });
  },
  drawsOutsideBounds: true,
});
