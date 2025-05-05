// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { VRIssueLikeTable } from '../../examples/vr/issue-like-table';

snapshotInformational(VRIssueLikeTable, {
	description: 'Issue Like Table',
	prepare: async (page: Page, component: Locator) => {
		await page.locator('[data-testid="column-picker-trigger-button"]').first().click();
	},
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		'platform-datasources-enable-two-way-sync-statuses': true,
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});
