// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table-j2ws';

snapshotInformational(IssueLikeTable, {
	description: 'Priority column - two way sync feature flag on, priority feature flag off',
	prepare: async (page: Page) => {
		await page.locator('[data-testid="link-datasource-render-type--icon"]').first().click();
		// Wait for tooltip to be present. We expect a tooltip to be present when there is no dropdown.
		// Not waiting for the tooltip could result in flaky test if the snapshot is delayed until after
		// the tooltip appears.
		await page
			.locator('[data-testid="issues-table-cell-tooltip-hidden"]')
			.first()
			.waitFor({ state: 'attached' });
	},
	drawsOutsideBounds: true,
	featureFlags: {
		enable_datasource_react_sweet_state: true,
		'platform-datasources-enable-two-way-sync-priority': false,
		enable_datasource_supporting_actions: true,
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
	description: 'Priority column - inline edit with flags enabled - loading',
	prepare: async (page: Page) => {
		await page.locator('[data-testid="link-datasource-render-type--icon"]').first().click();
		await page.getByRole('listbox').getByText('Loading').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	featureFlags: {
		enable_datasource_react_sweet_state: true,
		'platform-datasources-enable-two-way-sync-priority': true,
		enable_datasource_supporting_actions: true,
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
	description: 'Priority column - inline edit with flags enabled - options',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--icon').first().click();

		// Wait until the loaded priority option 'blocker' is visible in the dropdown
		await page.getByRole('listbox').getByText('Blocker').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	featureFlags: {
		enable_datasource_react_sweet_state: true,
		'platform-datasources-enable-two-way-sync-priority': true,
		enable_datasource_supporting_actions: true,
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
	description: 'Priority column - inline edit with flags enabled - options tooltip',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--icon').first().click();

		await page.getByRole('listbox').getByText('Low').waitFor({ state: 'visible' });
		await page.getByRole('listbox').getByText('Low').hover();
	},
	drawsOutsideBounds: true,
	featureFlags: {
		enable_datasource_react_sweet_state: true,
		'platform-datasources-enable-two-way-sync-priority': true,
		enable_datasource_supporting_actions: true,
	},
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
