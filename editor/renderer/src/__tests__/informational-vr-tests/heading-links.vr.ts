// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';
import {
	HeadingInsidePanel,
	HeadingInsideLayout,
	HeadingInsideTable,
	HeadingInsideExpand,
} from './heading-links.fixture';

snapshotInformational(HeadingInsidePanel, {
	selector: {
		byRole: 'heading',
	},
	prepare: async (page: Page, component: Locator) => {
		const heading = page.getByRole('heading');
		const copyLink = page.getByLabel('Copy link to heading');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideExpand, {
	ignoredErrors: [
		{
			// Gemini is complain because this component packages/editor/renderer/src/ui/Expand.tsx
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			pattern: /for a non-boolean attribute/,
			ignoredBecause: 'Because it is not part of the migration effort to fix warnings',
			jiraIssueId: 'TD-0000',
		},
	],
	selector: {
		byRole: 'heading',
		options: {
			name: 'Heading 1',
		},
	},
	description: 'heading inside expand first expand',
	prepare: async (page: Page, component: Locator) => {
		const expand = page.getByLabel('Expand content').first();
		const heading = page.getByRole('heading', { name: 'Heading 1' });
		const copyLink = heading.getByLabel('Copy link to heading');

		await expand.click();
		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideExpand, {
	description: 'heading inside expand second expand',
	ignoredErrors: [
		{
			// Gemini is complain because this component packages/editor/renderer/src/ui/Expand.tsx
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			pattern: /for a non-boolean attribute/,
			ignoredBecause: 'Because it is not part of the migration effort to fix warnings',
			jiraIssueId: 'TD-0000',
		},
	],
	selector: {
		byRole: 'heading',
		options: {
			name: 'Heading 2',
		},
	},
	prepare: async (page: Page, component: Locator) => {
		const expand = page.getByLabel('Expand content').nth(1);
		const heading = page.getByRole('heading', { name: 'Heading 2' });
		const copyLink = heading.getByLabel('Copy link to heading');

		await expand.click();
		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideTable, {
	description: 'heading inside table - first column',
	selector: {
		byRole: 'heading',
		options: {
			name: 'Table Heading 4',
		},
	},
	prepare: async (page: Page, component: Locator) => {
		const heading = page.getByRole('heading', {
			name: 'Table Heading 4',
		});
		const copyLink = heading.getByLabel('Copy link to heading');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideTable, {
	description: 'heading inside table - second column',
	selector: {
		byRole: 'heading',
		options: {
			name: 'Multiline heading that wraps',
		},
	},
	prepare: async (page: Page, component: Locator) => {
		const heading = page.getByRole('heading', {
			name: 'Multiline heading that wraps',
		});
		const copyLink = heading.getByLabel('Copy link to heading');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideTable, {
	description: 'heading inside table  second column but wrapped',
	selector: {
		byRole: 'heading',
		options: {
			name: 'Multiline heading that wraps',
		},
	},
	prepare: async (page: Page, component: Locator) => {
		await page.setViewportSize({
			width: 400,
			height: 400,
		});
		const heading = page.getByRole('heading', {
			name: 'Multiline heading that wraps',
		});
		const copyLink = heading.getByLabel('Copy link to heading');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideLayout, {
	description: 'heading inside layout  first column ',
	selector: {
		byRole: 'heading',
		options: {
			level: 4,
			name: 'LC Heading L',
		},
	},
	prepare: async (page: Page, component: Locator) => {
		await page.setViewportSize({
			width: 1200,
			height: 400,
		});
		const heading = page.getByRole('heading', {
			level: 4,
			name: 'LC Heading L',
		});
		const copyLink = heading.getByLabel('Copy link to heading');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideLayout, {
	description: 'heading inside layout second column',
	selector: {
		byRole: 'heading',
		options: {
			level: 4,
			name: 'RC Heading L',
		},
	},
	prepare: async (page: Page, component: Locator) => {
		await page.setViewportSize({
			width: 1200,
			height: 400,
		});
		const heading = page.getByRole('heading', {
			level: 4,
			name: 'RC Heading L',
		});
		const copyLink = heading.getByLabel('Copy link to heading');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});
