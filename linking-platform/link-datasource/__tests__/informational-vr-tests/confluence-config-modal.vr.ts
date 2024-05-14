import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import ConfluenceSearchConfigModal from '../../examples/with-confluence-search-modal';

const openLastUpdatedFilter = async (page: Page) => {
  await page.getByTestId('confluence-search-modal--date-range-button').click();
  await page.waitForSelector(
    '[data-testid="confluence-search-datasource-popup-container"]',
  );
};

snapshotInformational(ConfluenceSearchConfigModal, {
  prepare: async (page: Page) => {
    await openLastUpdatedFilter(page);
  },
  description: 'Last Updated filter open state',
  featureFlags: {
    'platform.linking-platform.datasource.show-clol-basic-filters': true,
  },
  drawsOutsideBounds: true,
});

snapshotInformational(ConfluenceSearchConfigModal, {
  prepare: async (page: Page) => {
    await openLastUpdatedFilter(page);
    await page.getByText('Custom').click();
    await page.waitForSelector(
      '[data-testid="custom-date-range-update-button"]',
    );
    // Waiting for table to load on the background
    await page.waitForSelector(
      '[data-testid="link-datasource-render-type--link"]',
    );
  },
  description: 'Last Updated filter open state with custom date pickers',
  featureFlags: {
    'platform.linking-platform.datasource.show-clol-basic-filters': true,
  },
  drawsOutsideBounds: true,
});

snapshotInformational(ConfluenceSearchConfigModal, {
  prepare: async (page: Page) => {
    await page
      .getByTestId('clol-basic-filter-editedOrCreatedBy-trigger--button')
      .click();
    await page.waitForSelector(
      '[data-testid="basic-filter-popup-select-option--avatar"]',
    );
  },
  description: 'Edited/Created by CLOL filter in open state',
  featureFlags: {
    'platform.linking-platform.datasource.show-clol-basic-filters': true,
  },
  drawsOutsideBounds: true,
});
