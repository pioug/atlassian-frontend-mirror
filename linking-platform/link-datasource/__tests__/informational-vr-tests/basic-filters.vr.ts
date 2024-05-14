// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import BasicFiltersVR from '../../examples/vr/basic-filters-vr';
import WithModal from '../../examples/with-issues-modal';
import { BasicFilterFieldType } from '../../src/ui/jira-issues-modal/basic-filters/types';

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

const filters: BasicFilterFieldType[] = [
  'project',
  'type',
  'status',
  'assignee',
];

const selectOption = async (
  page: Page,
  filter: string,
  optionsToClick: number = 2,
  closeAfterSelect: boolean = true,
) => {
  await page.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
  let optionType: string;

  if (filter === 'project' || filter === 'type') {
    optionType = 'icon-label';
  } else if (filter === 'status') {
    optionType = 'lozenge--text';
  } else {
    optionType = 'avatar';
  }

  const components = await page
    .locator(`[data-testid="basic-filter-popup-select-option--${optionType}"]`)
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
    'platform.linking-platform.datasource-word_wrap': true,
  },
});

snapshotInformational(WithModal, {
  ...options,
  drawsOutsideBounds: false,
  prepare: async (page: Page) => {
    await selectOption(page, 'project');
    await selectOption(page, 'status');
    await selectOption(page, 'type');
    await selectOption(page, 'assignee');
  },
  description: 'basic mode with basic filters with each filter selected',
  featureFlags: {
    'platform.linking-platform.datasource.show-jlol-basic-filters': true,
  },
  selector: {
    byTestId: 'jlol-basic-filter-container',
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

    prepare: async (page: Page, _component: Locator) => {
      await selectOption(page, filter, 1, false);
    },
    description: `${filter} open and option selected`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, _component: Locator) => {
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

      await page.fill(
        `#jlol-basic-filter-${filter}-popup-select--input`,
        `my ${filter}`,
      );

      // This is necessary for assignee to avoid flakiness when snapshot is taken before search has time to process and reload results
      await page
        .getByText('Unassigned', { exact: true })
        .waitFor({ state: 'detached' });
    },
    description: `${filter} open and search text entered`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();

      await page.fill(
        `#jlol-basic-filter-${filter}-popup-select--input`,
        `loading-message`,
      );

      await page
        .getByTestId(`jlol-basic-filter-${filter}--loading-message`)
        .waitFor({ state: 'visible' });
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
        `#jlol-basic-filter-${filter}-popup-select--input`,
        `empty-message`,
      );

      await component.getByTestId(
        `jlol-basic-filter-${filter}--no-options-message`,
      );
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
        `#jlol-basic-filter-${filter}-popup-select--input`,
        `error-message`,
      );

      await component.getByTestId(`jlol-basic-filter-${filter}--error-message`);
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
        `[data-testid="jlol-basic-filter-${filter}--show-more-button"]`,
      );
      showMoreButton.scrollIntoViewIfNeeded();

      await page.getByTestId(`jlol-basic-filter-${filter}--show-more-button`);
    },
    description: `${filter} open and view show more button`,
  });

  snapshotInformational(BasicFiltersVR, {
    ...options,

    prepare: async (page: Page, component: Locator) => {
      await component
        .getByTestId(`jlol-basic-filter-${filter}-trigger`)
        .click();
      await page.keyboard.press('Tab');
    },
    description: `${filter} open and focus show more button`,
  });
});
