// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

// eslint-disable-next-line no-restricted-imports -- informational VR requires snapshotInformational API.
import { snapshotInformational } from '@af/visual-regression';

import { SortableJiraIssuesTableNoLatency } from '../../examples/sortable-jira-issues-table';

const waitForTableLoaded = async (page: Page, expectedFirstKey: string) => {
	await page.waitForFunction(
		(firstKey) => {
			const table = document.querySelector('[data-testid="datasource-table-view"]');
			if (!table) {
				return false;
			}

			const hasNoLoadingRows =
				table.querySelector('[data-testid^="datasource-table-view--row-loading"]') === null;
			const hasExpectedFirstRow =
				table.querySelector(`tbody tr:first-of-type a[href$="/browse/${firstKey}"]`) !== null;

			return hasNoLoadingRows && hasExpectedFirstRow;
		},
		expectedFirstKey,
	);
};

snapshotInformational(SortableJiraIssuesTableNoLatency, {
	description: 'Sortable Jira Issues Table',
	drawsOutsideBounds: true,
	prepare: async (page: Page, _component: Locator) => {
		await waitForTableLoaded(page, 'SORT-103');
	},
	featureFlags: {},
});

snapshotInformational(SortableJiraIssuesTableNoLatency, {
	description: 'Sortable Jira Issues Table sorted by key',
	drawsOutsideBounds: true,
	prepare: async (page: Page, _component: Locator) => {
		await waitForTableLoaded(page, 'SORT-103');
		await page.getByTestId('key-column-sort-button').click();
		await page.waitForSelector('[data-testid="key-column-heading"][aria-sort="ascending"]');
		await waitForTableLoaded(page, 'SORT-101');
	},
	featureFlags: {},
});

snapshotInformational(SortableJiraIssuesTableNoLatency, {
	description: 'Sortable Jira Issues Table sorted by type descending',
	drawsOutsideBounds: true,
	prepare: async (page: Page, _component: Locator) => {
		await waitForTableLoaded(page, 'SORT-103');
		await page.getByTestId('issuetype-column-sort-button').click();
		await page.getByTestId('issuetype-column-sort-button').click();
		await page.waitForSelector('[data-testid="issuetype-column-heading"][aria-sort="descending"]');
		await waitForTableLoaded(page, 'SORT-101');
	},
	featureFlags: {},
});

