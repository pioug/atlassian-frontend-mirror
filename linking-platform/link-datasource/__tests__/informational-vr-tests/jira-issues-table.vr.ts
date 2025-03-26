// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import JiraIssuesTableSingleRow from '../../examples/vr/jira-issues-table-single-row-vr';
import JiraIssuesTable from '../../examples/vr/jira-issues-table-vr';

snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId(
				'datasource-table-view--row-ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/10',
			)
			.getByTestId('datasource-table-view--cell-6')
			.first()
			.hover();
	},
	drawsOutsideBounds: true,
	description: 'Hovering over "label, another, third" Labels',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId(
				'datasource-table-view--row-ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/30',
			)
			.getByTestId('datasource-table-view--cell-0')
			.getByRole('img')
			.hover();
	},
	drawsOutsideBounds: true,
	description: 'Hovering over "bug" Icon',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId(
				'datasource-table-view--row-ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/30',
			)
			.getByTestId('datasource-table-view--cell-4')
			.hover();
	},
	drawsOutsideBounds: true,
	description: 'Hovering over "Unassigned" Assignee',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId(
				'datasource-table-view--row-ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/60',
			)
			.getByTestId('datasource-table-view--cell-5')
			.hover();
	},
	drawsOutsideBounds: true,
	description: 'Hovering over People',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId(
				'datasource-table-view--row-ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/10',
			)
			.getByTestId('datasource-table-view--cell-7')
			.getByTestId('link-datasource-render-type--status')
			.hover();
	},
	drawsOutsideBounds: true,
	description: 'Hovering over "TO DO" Status',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId(
				'datasource-table-view--row-ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/30',
			)
			.getByTestId('datasource-table-view--cell-8')
			.hover();
	},
	drawsOutsideBounds: true,
	description: 'Hovering over Date',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(JiraIssuesTableSingleRow, {
	prepare: async (page: Page, _component: Locator) => {
		await page
			.getByTestId(
				'datasource-table-view--row-ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/10',
			)
			.getByTestId('datasource-table-view--cell-2')
			.hover();
	},
	drawsOutsideBounds: true,
	description: 'Hovering over summary',
});

snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId(`labels-column-heading`).hover();
	},
	drawsOutsideBounds: true,
	description: `Hovering over labels header`,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId(`people-column-heading`).hover();
	},
	drawsOutsideBounds: true,
	description: `Hovering over people header`,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId(`status-column-heading`).hover();
	},
	drawsOutsideBounds: true,
	description: `Hovering over status header`,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId(`description-column-heading`).hover();
	},
	drawsOutsideBounds: true,
	description: `Double lined date of creation header text is truncated with ellipses`,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId(`summary-column-dropdown`).click();
	},
	drawsOutsideBounds: true,
	description: `Click summary column dropdown to see its items`,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

snapshotInformational(JiraIssuesTable, {
	prepare: async (page: Page, _component: Locator) => {
		page.setViewportSize({ height: 800, width: 1500 });
		for (const key of ['link', 'description', 'labels']) {
			await page.getByTestId(`${key}-column-dropdown`).click();
			await page.getByTestId(`${key}-column-dropdown-item-toggle-wrapping`).click();
		}

		await page.getByTestId(`link-column-dropdown`).click();
	},
	drawsOutsideBounds: true,
	description: `Toggle wrapping on several columns`,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
