// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import {
	VRIssueLikeTableStatus,
	VRIssueLikeTableStatusLoading,
} from '../../examples/vr/issue-like-table-status';

snapshotInformational(VRIssueLikeTableStatusLoading, {
	description: 'Status column inline edit - loading',
	prepare: async (page: Page) => {
		await page.locator('[data-testid="link-datasource-render-type--status"]').first().click();
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

snapshotInformational(VRIssueLikeTableStatus, {
	description: 'Status column inline edit - options',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--status').first().click();
		await page.getByRole('listbox').getByText('Backlog').waitFor({ state: 'visible' });
	},
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
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

snapshotInformational(VRIssueLikeTableStatus, {
	description: 'Status column inline edit - options tooltip',
	prepare: async (page: Page) => {
		await page.getByTestId('link-datasource-render-type--status').first().click();

		await page.getByRole('listbox').getByText('Some').waitFor({ state: 'visible' });
		await page.getByRole('listbox').getByText('Some').hover();
	},
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
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
