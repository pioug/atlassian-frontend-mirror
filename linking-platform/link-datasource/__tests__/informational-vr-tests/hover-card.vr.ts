import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { VRIssueLikeTable } from '../../examples/vr/issue-like-table';

snapshotInformational(VRIssueLikeTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId('link-datasource-render-type--link')
			.getByText('DONUT-11720')
			.first()
			.hover();
		await page.waitForSelector('[data-testid="smart-links-container"]');
	},
	drawsOutsideBounds: true,
	description: 'issue like table hovering over key link',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});
