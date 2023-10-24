import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import BasicFiltersVR from '../../examples/basic-filters-vr';
import WithModal from '../../examples/with-modal';

type OptionsType = Parameters<typeof snapshotInformational>[1];

const options: OptionsType = {
  variants: [
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
  drawsOutsideBounds: true,
};

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (page: Page, _component: Locator) => {
    await page.getByText('ProjectTypeStatusAssignee');
  },
  description: 'default state for all filters',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-project-trigger').click();
    const firstOption = page.locator('#react-select-2-option-0');
    await firstOption.waitFor({ state: 'visible' });
  },
  description: 'project open trigger',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-project-trigger').click();
    await page.locator('#react-select-2-option-0 span').first().click();
  },
  description: 'project open and option selected',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (_page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-issuetype-trigger').click();
  },
  description: 'type open trigger',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-issuetype-trigger').click();
    await page.locator('#react-select-2-option-0 span').first().click();
  },
  description: 'type open and option selected',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (_page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-status-trigger').click();
  },
  description: 'status open trigger',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-status-trigger').click();
    await page.locator('#react-select-2-option-0 span').first().click();
  },
  description: 'status open and option selected',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (_page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-assignee-trigger').click();
  },
  description: 'assignee open trigger',
});

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (page: Page, component: Locator) => {
    await component.getByTestId('jlol-basic-filter-assignee-trigger').click();
    await page.locator('#react-select-2-option-0 span').first().click();
  },
  description: 'assignee open and option selected',
});

snapshotInformational(WithModal, {
  ...options,

  prepare: async (page: Page, component: Locator) => {
    await page.getByTestId('mode-toggle-basic').click();
  },
  description: 'basic mode with basic filters',
  featureFlags: {
    'platform.linking-platform.datasource.show-jlol-basic-filters': true,
  },
});
