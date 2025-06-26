// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import {
	VRIssueLikeTablePriorities,
	VRIssueLikeTablePrioritiesLoading,
} from '../../examples/vr/issue-like-table-priorities';

snapshotInformational(VRIssueLikeTablePrioritiesLoading, {
	// TODO: Rename this test when cleaning platform-linking-visual-refresh-sllv
	description: 'Priority column - inline edit with flags enabled - loading',
	prepare: async (page: Page) => {
		await page.locator('[data-testid="link-datasource-render-type--icon"]').first().click();
		await page.getByRole('listbox').getByText('Loading').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	waitForHold: true,
});

snapshotInformational(VRIssueLikeTablePriorities, {
	// TODO: Rename this test when cleaning platform-linking-visual-refresh-sllv
	description: 'Priority column - inline edit with flags enabled - options',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--icon').first().click();

		// Wait until the loaded priority option 'blocker' is visible in the dropdown
		await page.getByRole('listbox').getByText('Blocker').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	waitForHold: true,
});

snapshotInformational(VRIssueLikeTablePriorities, {
	// TODO: Rename this test when cleaning platform-linking-visual-refresh-sllv
	description: 'Priority column - inline edit with flags enabled - options tooltip',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--icon').first().click();

		await page.getByRole('listbox').getByText('Low').waitFor({ state: 'visible' });
		await page.getByRole('listbox').getByText('Low').hover();
	},
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	waitForHold: true,
});
