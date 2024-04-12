import { snapshotInformational } from '@af/visual-regression';
import { ExtensionsWithinExpand } from './extension.fixture';
import type { Locator, Page } from '@playwright/test';

snapshotInformational(ExtensionsWithinExpand, {
  prepare: async (page: Page, component: Locator) => {
    const expandButton = page.getByText('Click here to expand...');
    await expandButton.hover();
    await expandButton.click();
    await page
      .getByText('normal with data provider')
      .waitFor({ state: 'visible' });
  },
});
