import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { VREmptyStateHoverable } from '../../examples/vr/empty-state-vr.vr.ap';
import {
	VRJiraIssueTableDaterangeHoverable,
	VRJiraIssueTableHoverable,
} from '../../examples/vr/jira-issues-table-vr.vr.ap';

type OptionsType = Parameters<typeof snapshotInformational>[1];

const options: OptionsType = {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	drawsOutsideBounds: true,
};

const hoverableContainerSelector = '[data-testid="examples-hoverable-container"]';

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(VRJiraIssueTableHoverable, {
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
	waitForHold: true,
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(VRJiraIssueTableDaterangeHoverable, {
	...options,
	prepare: async (page: Page) => {
		await page.hover(hoverableContainerSelector);
	},
	description: 'jira issues table with daterange column on a hoverable surface',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	waitForHold: true,
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(VREmptyStateHoverable, {
	...options,
	prepare: async (page: Page) => {
		await page.hover(hoverableContainerSelector);
	},
	description: 'empty state table on a hoverable surface',
	waitForHold: true,
});
