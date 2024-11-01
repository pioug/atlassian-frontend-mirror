// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table-j2ws';

snapshotInformational(IssueLikeTable, {
	description: 'Status column inline edit - loading',
	prepare: async (page: Page, component: Locator) => {
		await page.locator('[data-testid="link-datasource-render-type--status"]').first().click();
	},
	drawsOutsideBounds: true,
	featureFlags: {
		enable_datasource_react_sweet_state: true,
		'platform-datasources-enable-two-way-sync': true,
		'platform-datasources-enable-two-way-sync-statuses': true,
	},
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(IssueLikeTable, {
	description: 'Status column inline edit - options',
	prepare: async (page: Page, component: Locator) => {
		await page.getByTestId('link-datasource-render-type--status').first().click();
		await page.getByRole('listbox').getByText('To Do').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	featureFlags: {
		enable_datasource_react_sweet_state: true,
		'platform-datasources-enable-two-way-sync': true,
		'platform-datasources-enable-two-way-sync-statuses': true,
	},
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
