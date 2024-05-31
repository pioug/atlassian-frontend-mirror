import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import {
	RendererLeftAndRightWrappedMediaLinkInsideTable,
	RendererLeftWrappedMediaLinkInsideTable,
	RendererMediaLink,
	RendererMediaLinkInsideExpand,
	RendererMediaLinkInsideNestedExpand,
	RendererMediaLinkInsideTable,
	RendererMediaLinkWrapped,
	RendererRightWrappedMediaLinkInsideTable,
} from './media-link.fixtures';

snapshotInformational(RendererMediaLink, {});

snapshotInformational.skip(RendererMediaLink, {
	description: 'should render a linked media image correctly when clicked',
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');

		await media.hover();
		await media.click();
	},
});

snapshotInformational(RendererMediaLink, {
	description: 'should render a linked media image correctly when focused',
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.focus();
		await media.hover();
	},
});

snapshotInformational(RendererMediaLinkWrapped, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');

		await media.nth(0).waitFor({ state: 'visible' });
		await media.nth(1).waitFor({ state: 'visible' });
	},
});

snapshotInformational(RendererMediaLinkWrapped, {
	description: 'should render a linked media image below a wrapped image correctly when focused',
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await media.nth(0).waitFor({ state: 'visible' });
		await media.nth(1).waitFor({ state: 'visible' });

		await link.focus();
		await media.nth(1).hover();
	},
});

snapshotInformational(RendererMediaLinkInsideExpand, {
	ignoredErrors: [
		{
			// Gemini is complain because this component packages/editor/renderer/src/ui/Expand.tsx
			pattern: /for a non-boolean attribute/,
			ignoredBecause: 'Because it is not part of the migration effort to fix warnings',
			jiraIssueId: 'TD-0000',
		},
	],
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');
		const expandButton = page.getByRole('button');

		await expandButton.click();
		await link.focus();
		await media.hover();
	},
});

snapshotInformational(RendererMediaLinkInsideNestedExpand, {
	ignoredErrors: [
		{
			// Gemini is complain because this component packages/editor/renderer/src/ui/Expand.tsx
			pattern: /for a non-boolean attribute/,
			ignoredBecause: 'Because it is not part of the migration effort to fix warnings',
			jiraIssueId: 'TD-0000',
		},
	],
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');
		const expandButton = page.getByRole('button', {
			name: 'Click here to expand',
		});

		await expandButton.click();
		await link.focus();
		await media.hover();
	},
});

snapshotInformational(RendererMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});

snapshotInformational(RendererRightWrappedMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});

snapshotInformational(RendererLeftWrappedMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});

snapshotInformational(RendererLeftAndRightWrappedMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});
