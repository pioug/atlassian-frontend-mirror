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

const filters = ['project', 'issuetype', 'status', 'assignee'];

snapshotInformational(BasicFiltersVR, {
  ...options,

  prepare: async (page: Page, _component: Locator) => {
    await page.getByText('ProjectTypeStatusAssignee');
  },
  description: 'default state for all filters',
});

snapshotInformational(WithModal, {
  ...options,

  prepare: async (page: Page) => {
    await page.getByTestId('mode-toggle-basic').click();
  },
  description: 'basic mode with basic filters',
  featureFlags: {
    'platform.linking-platform.datasource.show-jlol-basic-filters': true,
  },
});

filters.forEach(filter => {
  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();
      const firstOption = page.locator('#react-select-2-option-0');
      await firstOption.waitFor({ state: 'visible' });
    },
    description: `${filter} open trigger`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();
      await page.locator('#react-select-2-option-0 span').first().click();
    },
    description: `${filter} open and option selected`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();
      await page.type('#jlol-basic-filter-popup-select--input', `my ${filter}`);
    },
    description: `${filter} open and search text entered`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();

      await page.type(
        '#jlol-basic-filter-popup-select--input',
        `loading-message`,
      );

      await page.waitForTimeout(1000);
    },
    description: `${filter} open and view loading state`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();

      await page.type(
        '#jlol-basic-filter-popup-select--input',
        `empty-message`,
      );

      await page.waitForTimeout(1000);
    },
    description: `${filter} open and view empty state`,
  });
});
