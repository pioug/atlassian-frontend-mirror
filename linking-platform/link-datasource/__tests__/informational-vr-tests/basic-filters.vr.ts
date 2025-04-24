// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import BasicFiltersVR from '../../examples/vr/basic-filters-vr';
import {
	WithIssueModalWithParametersInformational as WithIssueModalWithParameters,
	JiraModalNoSuspense as WithModal,
} from '../../examples/with-issues-modal';
import { type BasicFilterFieldType } from '../../src/ui/jira-issues-modal/basic-filters/types';

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

const filters: BasicFilterFieldType[] = ['project', 'type', 'status', 'assignee'];

const selectOption = async (
	page: Page,
	filter: string,
	optionsToClick: number = 2,
	closeAfterSelect: boolean = true,
) => {
	await page.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
	await page
		.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
		.waitFor({ state: 'visible' });
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
	waitForHold: true,
});

snapshotInformational(WithModal, {
	...options,

	prepare: async (page: Page) => {
		await page.getByTestId('mode-toggle-basic').click();
	},
	description: 'basic mode with basic filters',
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

snapshotInformational(WithIssueModalWithParameters, {
	...options,
	drawsOutsideBounds: false,
	prepare: async (page: Page) => {
		await page.getByTestId('jira-datasource-table').waitFor({ state: 'visible' });
	},
	description: 'basic mode with basic filters with each filter selected',
	selector: {
		byTestId: 'jlol-basic-filter-container',
	},
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
	waitForHold: true,
});

filters.forEach((filter) => {
	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			const firstOption = page.locator('#react-select-2-option-0');
			await firstOption.waitFor({ state: 'visible' });
		},
		description: `${filter} open trigger`,
		featureFlags: {
			'platform-component-visual-refresh': [true, false],
			'platform-linking-visual-refresh-sllv': [true, false],
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, _component: Locator) => {
			await selectOption(page, filter, 1, false);
		},
		description: `${filter} open and option selected`,
		featureFlags: {
			'platform-component-visual-refresh': [true, false],
			'platform-linking-visual-refresh-sllv': [true, false],
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, _component: Locator) => {
			await selectOption(page, filter);
		},
		description: `${filter} closed and multiple options selected`,
		featureFlags: {
			'platform-linking-visual-refresh-sllv': [true, false],
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			await page.fill(`#jlol-basic-filter-${filter}-popup-select--input`, `my ${filter}`);

			// This is necessary for assignee to avoid flakiness when snapshot is taken before search has time to process and reload results
			await page.getByText('Unassigned', { exact: true }).waitFor({ state: 'detached' });
		},
		description: `${filter} open and search text entered`,
		featureFlags: {
			'platform-component-visual-refresh': [true, false],
			'platform-linking-visual-refresh-sllv': [true, false],
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			await page.fill(`#jlol-basic-filter-${filter}-popup-select--input`, `loading-message`);

			await page
				.getByRole('heading', { name: 'Loading...', exact: true })
				.waitFor({ state: 'visible' });

			await page
				.getByTestId(`jlol-basic-filter-${filter}--loading-message`)
				.waitFor({ state: 'visible' });
		},
		description: `${filter} open and view loading state`,
		featureFlags: {
			'platform-linking-visual-refresh-sllv': [true, false],
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			await page.fill(`#jlol-basic-filter-${filter}-popup-select--input`, `empty-message`);

			await page
				.getByRole('heading', {
					name: "We couldn't find anything matching your search",
					exact: true,
				})
				.waitFor({ state: 'visible' });
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.getByText('Try again with a different term.')
				.waitFor({ state: 'visible' });

			await component.getByTestId(`jlol-basic-filter-${filter}--no-options-message`);
		},
		description: `${filter} open and view empty state - platform-linking-visual-refresh-sllv true`,
		featureFlags: {
			'platform-linking-visual-refresh-sllv': true,
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			await page.fill(`#jlol-basic-filter-${filter}-popup-select--input`, `empty-message`);

			await page
				.getByRole('heading', { name: 'No matches found', exact: true })
				.waitFor({ state: 'visible' });

			await component.getByTestId(`jlol-basic-filter-${filter}--no-options-message`);
		},
		description: `${filter} open and view empty state - platform-linking-visual-refresh-sllv false`,
		featureFlags: {
			'platform-linking-visual-refresh-sllv': false,
		},
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			await page.fill(`#jlol-basic-filter-${filter}-popup-select--input`, `error-message`);

			await page
				.getByRole('heading', { name: 'We ran into an issue trying to load results', exact: true })
				.waitFor({ state: 'visible' });

			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.getByText('Check your connection and refresh');

			await component.getByTestId(`jlol-basic-filter-${filter}--error-message`);
		},
		description: `${filter} open and view error state - platform-linking-visual-refresh-sllv true`,
		featureFlags: {
			'platform-linking-visual-refresh-sllv': true,
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			await page.fill(`#jlol-basic-filter-${filter}-popup-select--input`, `error-message`);

			await page
				.getByRole('heading', { name: 'Something went wrong', exact: true })
				.waitFor({ state: 'visible' });

			await component.getByTestId(`jlol-basic-filter-${filter}--error-message`);
		},
		description: `${filter} open and view error state - platform-linking-visual-refresh-sllv false`,
		featureFlags: {
			'platform-linking-visual-refresh-sllv': false,
		},
		waitForHold: true,
	});

	snapshotInformational(BasicFiltersVR, {
		...options,

		prepare: async (page: Page, component: Locator) => {
			await component.getByTestId(`jlol-basic-filter-${filter}-trigger`).click();
			await page
				.getByTestId(`jlol-basic-filter-${filter}-popup-select-select--container`)
				.waitFor({ state: 'visible' });
			await page.keyboard.press('Tab');
		},
		description: `${filter} open and focus show more button`,
		featureFlags: {
			'platform-component-visual-refresh': [true, false],
			'platform-linking-visual-refresh-sllv': [true, false],
		},
		waitForHold: true,
	});
});
