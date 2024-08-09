import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table';

snapshotInformational(IssueLikeTable, {
	description: 'drag column',
	prepare: async (page: Page) => {
		const source = await page.locator('[data-testid="type-column-heading"]').first();
		const target = await page
			.locator('[data-testid="people-column-heading"] [data-testid="column-drop-target"]')
			.first();

		await source.dragTo(target, {
			force: true,
			sourcePosition: { x: 0, y: 0 },
		});
	},
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
