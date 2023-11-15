// eslint-disable-next-line import/no-extraneous-dependencies
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

const selectOption = async (
  page: Page,
  filter: string,
  optionsToClick: number = 2,
  closeAfterSelect: boolean = true,
) => {
  await page.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
  let optionType: string;

  if (filter === 'project' || filter === 'issuetype') {
    optionType = 'icon-label';
  } else if (filter === 'status') {
    optionType = 'lozenge--text';
  } else {
    optionType = 'avatar';
  }

  const components = await page
    .locator(
      `[data-testid="jlol-basic-filter-popup-select-option--${optionType}"]`,
    )
    .all();

  for (let i = 0; i < optionsToClick; i++) {
    await components[i].click();
  }

  if (closeAfterSelect) {
    await page.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
  }
};

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

snapshotInformational(WithModal, {
  ...options,

  prepare: async (page: Page) => {
    await page.getByTestId('mode-toggle-basic').click();

    await selectOption(page, 'project');
    await selectOption(page, 'status');
    await selectOption(page, 'issuetype');
    await selectOption(page, 'assignee');
  },
  description: 'basic mode with basic filters with each filter selected',
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
      await selectOption(page, filter, 1, false);
    },
    description: `${filter} open and option selected`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await selectOption(page, filter);
    },
    description: `${filter} closed and multiple options selected`,
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

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();

      await page.type(
        '#jlol-basic-filter-popup-select--input',
        `error-message`,
      );

      await page.waitForTimeout(1000);
    },
    description: `${filter} open and view error state`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();

      const showMoreButton = page.locator(
        '[data-testid="jlol-basic-filter-popup-select--show-more-button"]',
      );
      showMoreButton.scrollIntoViewIfNeeded();

      await page.getByTestId(
        'jlol-basic-filter-popup-select--show-more-button',
      );
    },
    description: `${filter} open and view show more button`,
  });
});
