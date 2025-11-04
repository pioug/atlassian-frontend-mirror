// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import {
	VRIssueLikeTableUser,
	VRIssueLikeTableUserLoading,
} from '../../examples/vr/issue-like-table-users';

snapshotInformational(VRIssueLikeTableUserLoading, {
	description: 'User column - inline edit with flags enabled - loading',
	prepare: async (page: Page) => {
		await page.locator('[data-testid="link-datasource-render-type--user"]').first().click();
		await page.getByRole('listbox').getByText('Loading').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	waitForHold: true,
});

snapshotInformational(VRIssueLikeTableUser, {
	description: 'User column - inline edit with flags enabled - options',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--user').first().click();

		// Wait until the loaded user option 'blocker' is visible in the dropdown
		await page.getByRole('listbox').getByText('Scott').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	waitForHold: true,
});

snapshotInformational(VRIssueLikeTableUser, {
	description: 'User column - inline edit with flags enabled - options tooltip',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--user').first().click();

		// Wait until the loaded user option 'blocker' is visible in the dropdown
		await page.getByRole('listbox').getByText('Mike').waitFor({ state: 'visible' });
		await page.getByRole('listbox').getByText('Mike').hover();
	},
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	waitForHold: true,
});
