import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import EmptyState from '../../examples/vr/empty-state-vr';
import JiraIssuesTable from '../../examples/vr/jira-issues-table-vr';

type OptionsType = Parameters<typeof snapshotInformational>[1];

const options: OptionsType = {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
	drawsOutsideBounds: true,
};

const hoverableContainerSelector = '[data-testid="examples-hoverable-container"]';

snapshotInformational(JiraIssuesTable, {
	...options,
	prepare: async (page: Page) => {
		await page.hover(hoverableContainerSelector);
	},
	description: 'jira issues table on a hoverable surface',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(EmptyState, {
	...options,
	prepare: async (page: Page) => {
		await page.hover(hoverableContainerSelector);
	},
	description: 'empty state table on a hoverable surface',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
